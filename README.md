# VibeSec Frontend

A secure authentication frontend for VibeSec built with Next.js 15 and TypeScript.

## Features

- 🔐 **GitHub OAuth Authentication** - Secure login via GitHub
- 🛡️ **JWT & CSRF Protection** - Industry-standard security
- 🍪 **Secure Cookie Management** - HttpOnly and SameSite cookies
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- ⚡ **Fast & Reliable** - Built with Next.js 15 and Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- VibeSec backend running

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vibesec-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Authentication Flow

1. **Login** (`/login`) - GitHub OAuth login page
2. **OAuth Redirect** - GitHub handles user authorization
3. **Code Exchange** (`/`) - Exchanges OAuth code for session tokens
4. **Dashboard** (`/dashboard`) - Protected user area

## Project Structure

```
app/
├── dashboard/          # Protected dashboard page
├── login/             # GitHub OAuth login page  
├── globals.css        # Global styles
├── layout.tsx         # Root layout
└── page.tsx          # OAuth code exchange handler
```

## Security Features

- **CSRF Protection** - Cross-site request forgery prevention
- **Secure Cookies** - HttpOnly, Secure, SameSite attributes
- **JWT Tokens** - Stateless authentication
- **OAuth 2.0** - Industry-standard authorization

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: GitHub OAuth + JWT

## Environment

- **Backend**: `https://backend.vibesec.app`
- **OAuth Provider**: GitHub
- **Deployment**: Vercel-ready

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```
