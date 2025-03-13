# IssueReporter

A mobile-optimized web application for reporting facility issues through photos and descriptions, with company response capabilities.

## Features

- **Quick Photo Reporting**: Take pictures of issues directly through the app
- **Issue Descriptions**: Add text details to clarify reported problems
- **Company Responses**: Allow relevant entities to respond to reported issues
- **OAuth Authentication**: Sign in with Google or Apple accounts
- **PayPal Donations**: Enable thank-you donations from companies to reporters
- **Mobile Optimized**: Designed with mobile devices as the primary target

## Technology Stack

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Authentication**: OAuth2 with Google and Apple providers
- **Containerization**: Docker & Docker Compose
- **Payments**: PayPal API integration

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js (for local frontend development)
- Python 3.10+ (for local backend development)

### Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/IssueReporter.git
   cd IssueReporter
   ```

2. Start the development environment:
   ```
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Project Structure

```
IssueReporter/
├── backend/             # Python FastAPI backend
├── frontend/            # React TypeScript frontend
├── docker/              # Docker configuration files
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT 