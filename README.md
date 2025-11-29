# ClarivueOS

AI-Powered Interview Analytics and Student Readiness Platform

## 🚀 Quick Starts

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📋 Features

- **AI-Powered Interview Analytics** - Real-time assessment and feedback
- **Student Readiness Dashboard** - Track progress across cohorts  
- **Adaptive Interview Flow** - Smart role-based predictions and personalization
- **WebRTC Video Interviews** - Browser-based interview platform
- **Comprehensive Reporting** - Detailed insights and trends
- **Modern UI/UX** - Clean, responsive design with brand consistency

## 🛠 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Radix UI
- **Routing:** React Router v7
- **Icons:** Lucide React

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-based page components  
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers
├── lib/                # Utilities and API clients
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

## 🎯 Key Routes

### Public Routes
- `/invite/:token` - Student interview invitation entry
- `/session/:sessionId/*` - Interview flow (7-step process)
- `/login` - Administrator authentication

### Protected Routes  
- `/overview` - Main dashboard
- `/cohorts` - Cohort management
- `/students` - Student management
- `/reports` - Analytics and reporting

## 🔧 Environment Setup

Create `.env.local` for development:
```bash
# Add your environment variables here
VITE_API_BASE_URL=your_api_url
```

For production, configure environment variables in your deployment platform.

## 🚀 Deployment

This project is optimized for Vercel deployment:

1. **Connect Repository** - Link your GitHub repo to Vercel
2. **Configure Build** - Build settings are pre-configured in vercel.json  
3. **Set Environment Variables** - Add production environment variables in Vercel dashboard
4. **Deploy** - Automatic deployments on push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🎨 Brand Colors

- **Primary:** #102c64 (Navy)
- **Accent:** #FE686D (Coral)
- **Secondary:** #C8A0FE (Lavender)

## 📝 License

Built with ❤️ for educational technology advancement.
