import os
import shutil
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.issue import Issue
from app.models.user import User
from app.models.company import Company
from app.models.response import Response
from app.schemas.issue import IssueCreate, IssueResponse, IssueUpdate, IssueDetailResponse
from app.auth.jwt import get_current_active_user
from app.core.config import settings
from app.utils.geo import haversine_distance

router = APIRouter()

@router.post("/", response_model=IssueResponse)
async def create_issue(
    title: str = Form(...),
    description: str = Form(None),
    location: str = Form(None),
    assigned_company_id: Optional[int] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new issue report with photo and optional company assignment
    """
    # Validate file type
    file_extension = os.path.splitext(photo.filename)[1].lower()
    if file_extension[1:] not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Create unique filename
    import uuid
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_FOLDER, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)
    
    # Verify company exists if assigned_company_id is provided
    if assigned_company_id:
        company = db.query(Company).filter(
            Company.id == assigned_company_id,
            Company.is_active == True
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
    
    # Create issue in database
    db_issue = Issue(
        title=title,
        description=description,
        location=location,
        photo_path=unique_filename,
        reporter_id=current_user.id,
        assigned_company_id=assigned_company_id
    )
    
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    
    return db_issue

@router.get("/", response_model=List[IssueResponse])
def read_issues(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all issues (with pagination and optional status filter)
    """
    query = db.query(Issue)
    
    # Filter by status if provided
    if status:
        query = query.filter(Issue.status == status)
    
    # Get paginated results
    issues = query.offset(skip).limit(limit).all()
    return issues

@router.get("/{issue_id}", response_model=IssueDetailResponse)
def read_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get specific issue by ID with company details
    """
    # Query issue with join to company
    result = db.query(
        Issue,
        Company.name.label("company_name"),
        Company.email.label("company_email"),
        Company.phone.label("company_phone"),
        func.count(Response.id).label("response_count")
    ).outerjoin(
        Company, Issue.assigned_company_id == Company.id
    ).outerjoin(
        Response, Issue.id == Response.issue_id
    ).filter(
        Issue.id == issue_id
    ).group_by(
        Issue.id, Company.id
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    
    # Create response with issue and company data
    issue = result[0]
    response_data = {
        "id": issue.id,
        "title": issue.title,
        "description": issue.description,
        "location": issue.location,
        "photo_path": issue.photo_path,
        "status": issue.status,
        "created_at": issue.created_at,
        "updated_at": issue.updated_at,
        "reporter_id": issue.reporter_id,
        "assigned_company_id": issue.assigned_company_id,
        "company_name": result.company_name,
        "company_email": result.company_email,
        "company_phone": result.company_phone,
        "response_count": result.response_count
    }
    
    return response_data

@router.put("/{issue_id}", response_model=IssueResponse)
def update_issue(
    issue_id: int,
    issue_update: IssueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update an issue
    """
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    
    # Check if user is the reporter
    if issue.reporter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if company exists if assigned_company_id is being updated
    if issue_update.assigned_company_id is not None:
        company = db.query(Company).filter(
            Company.id == issue_update.assigned_company_id,
            Company.is_active == True
        ).first()
        
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
    
    # Update fields that are not None
    update_data = issue_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(issue, field, value)
    
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue 