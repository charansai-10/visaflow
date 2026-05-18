# Visaflow

A fullstack visa management application built with FastAPI (backend) and React/Vite (frontend).

---

## 🚀 Tech Stack

- **Backend:** FastAPI, PostgreSQL, Redis, SQLAlchemy
- **Frontend:** React, Vite, TypeScript
- **Auth:** JWT (Access + Refresh tokens), Google OAuth, LinkedIn OAuth
- **Storage:** AWS S3
- **Payments:** Stripe
- **Email:** SMTP / SendGrid / Resend (configurable)
- **AI:** Anthropic Claude API

---

## ⚙️ Environment Setup

### Backend (`backend/.env`)

```env
# App
APP_ENV=development
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
LOCAL_DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@localhost:5433/visaflow
ZOHO_DATABASE_URL=mysql+aiomysql://USERNAME:PASSWORD@db.catalyst.zoho.com:3306/DATABASE_NAME
DATABASE_ENV=local
SYNC_DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/visaflow

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
COOKIE_SECURE=False

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET=visaflow-documents

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (choose one option)
# Option A: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@visaflow.com

# Option B: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxx
# SENDGRID_FROM_EMAIL=noreply@visaflow.com

# Option C: Resend
# RESEND_API_KEY=re_xxxxxxxxxxxx
# RESEND_FROM_EMAIL=noreply@visaflow.com

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/linkedin/callback

# Zoho
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_ORG_ID=your_zoho_org_id
ZOHO_WORKSPACE_ID=your_zoho_workspace_id

# Debug
DEBUG=False
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8001/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_MICROSOFT_TENANT_ID=common
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

---

## 🛠️ Getting Started

### Backend
```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # Fill in your values
uvicorn main:app --reload --port 8001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env     # Fill in your values
npm run dev
```

---

## 📁 Project Structure
