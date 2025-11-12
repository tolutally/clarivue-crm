# AI Backend API Documentation

## Overview
The AI backend service provides intelligent analysis for the CRM using OpenAI GPT-4.

## Setup

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `PORT` - Backend server port (default: 3001)

### 2. Running the Backend

Development mode (with auto-reload):
```bash
npm run backend:dev
```

Production mode:
```bash
npm run backend
```

## API Endpoints

### Health Check
```
GET /health
```

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Analyze Contact
```
POST /api/analyze-contact
```

Analyzes a contact's relationship health or suggests next action.

**Request Body:**
```json
{
  "contactId": "uuid",
  "analysisType": "relationship" // or "next-action"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "AI-generated analysis text",
  "type": "relationship",
  "contactId": "uuid"
}
```

### Analyze Deal
```
POST /api/analyze-deal
```

Analyzes a deal for risk factors.

**Request Body:**
```json
{
  "dealId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "AI-generated risk analysis",
  "dealId": "uuid"
}
```

### Analyze Transcript
```
POST /api/analyze-transcript
```

Analyzes a call transcript to extract insights.

**Request Body:**
```json
{
  "transcript": "Full call transcript text",
  "summary": "Optional brief summary"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "AI-generated call analysis with key topics, sentiment, action items, and red flags"
}
```

## Architecture

### Folder Structure
```
backend/
├── api/                      # API route handlers
│   ├── analyzeContact.ts     # Contact analysis endpoint
│   ├── analyzeDeal.ts        # Deal risk analysis endpoint
│   └── analyzeTranscript.ts  # Call transcript analysis endpoint
├── lib/                      # Utilities and helpers
│   ├── openaiClient.ts       # OpenAI SDK wrapper
│   ├── supabase.ts           # Supabase client for backend
│   ├── buildContactContext.ts # Context builder for contacts
│   ├── buildDealContext.ts   # Context builder for deals
│   └── promptTemplates.ts    # AI prompt templates
├── types/                    # TypeScript type definitions
└── server.ts                 # Express server setup
```

### Context Building
The backend fetches relevant data from Supabase and formats it into context strings for the AI:

- **Contact Context**: Contact details, related deals, recent activities
- **Deal Context**: Deal details, contact info, deal activities, deal age

### Cost Estimation
Using GPT-4:
- Average request: ~2000 input tokens + 500 output tokens
- Cost per analysis: ~$0.09
- Optimization strategies: Limit activity history, cache common analyses

## Error Handling
All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad request (missing parameters)
- `500` - Server error (OpenAI API failure, database error)
