# BlackNWhite

A local first document management system built with Node.js and JavaScript, featuring OCR-based document processing, full-text search, and AI based search. File types currently supported are: pdf, docx, jpeg, png and txt.

## Features
 
- **Upload and store documents**: securely upload documents for safekeeping and later retrieval.
- **Automatic text recognition**: scanned documents and images are automatically converted to searchable text.
- **Search by content**: find any document by the words written inside it.
- **Secure accounts**: login-protected access keeps user's documents private
- **Bulk uploads**: documents are processed in the background, so the system stays responsive and nothing gets lost when many files are uploaded at once.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, JavaScript |
| Web framework | Express.js |
| Database | PostgreSQL |
| Queue | pg-boss |
| Auth | JWT |
| Logging | pino |
| Containerization | Docker |
| OCR Engine | Tesseract |

## Architecture

```
Client
  │
  ▼
Express API ──► parse-queue (pg-boss) ──► OCR Worker
  │                                            │
  │                                            ▼
  │                                   parse-results-queue
  │                                            │
  ▼                                            ▼
PostgreSQL (documents, full-text search) ◄─────┘
```

> Diagram is a rough sketch

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js

### Setup

```bash
# Clone the repository
git clone https://github.com/theMaverick7/blacknwhite.git
cd blacknwhite

# Copy environment variables
cp .env.example .env

# Start services with Docker Compose
docker compose up --build
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PORT` | API server port |

## Future Features

- AI based Search.
- Support for more document types.
