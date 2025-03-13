from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import paypalrestsdk

from app.db.session import get_db
from app.models.donation import Donation
from app.models.issue import Issue
from app.models.company import Company
from app.models.user import User
from app.schemas.donation import DonationCreate, DonationResponse
from app.auth.jwt import get_current_active_user
from app.core.config import settings

router = APIRouter()

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": settings.PAYPAL_MODE,  # sandbox or live
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET,
})

@router.post("/create-payment", response_model=dict)
async def create_payment(
    donation: DonationCreate,
    db: Session = Depends(get_db),
    current_user: Company = Depends(get_current_active_user)
) -> Any:
    """
    Create a PayPal payment from a company to a reporter
    """
    # Verify issue exists
    issue = db.query(Issue).filter(Issue.id == donation.issue_id).first()
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    
    # Create PayPal payment
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/donation/success",
            "cancel_url": "http://localhost:3000/donation/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": f"Donation for Issue #{issue.id}",
                    "sku": f"issue-{issue.id}",
                    "price": str(donation.amount),
                    "currency": donation.currency,
                    "quantity": 1
                }]
            },
            "amount": {
                "total": str(donation.amount),
                "currency": donation.currency
            },
            "description": f"Thank you donation for issue report #{issue.id}"
        }]
    })
    
    if payment.create():
        # Get approval URL
        approval_url = next(link.href for link in payment.links if link.rel == "approval_url")
        
        # Create donation record in pending state
        db_donation = Donation(
            amount=donation.amount,
            currency=donation.currency,
            payment_id=payment.id,
            payment_status="pending",
            issue_id=issue.id,
            company_id=current_user.id,
            recipient_id=issue.reporter_id
        )
        
        db.add(db_donation)
        db.commit()
        
        return {"approval_url": approval_url, "payment_id": payment.id}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment creation failed: {payment.error}"
        )

@router.get("/execute-payment/{payment_id}", response_model=DonationResponse)
async def execute_payment(
    payment_id: str,
    payer_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
) -> Any:
    """
    Execute a previously approved PayPal payment
    """
    # Find the donation record
    donation = db.query(Donation).filter(Donation.payment_id == payment_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    # Execute the payment
    payment = paypalrestsdk.Payment.find(payment_id)
    if payment.execute({"payer_id": payer_id}):
        # Update donation status
        donation.payment_status = "completed"
        db.commit()
        db.refresh(donation)
        
        return donation
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment execution failed: {payment.error}"
        ) 