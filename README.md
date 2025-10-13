# Clarivue Intelligence - Interview Analytics Dashboard

<div align="center">
  <img src="frontend/public/clarivue-favicon/favicon.svg" alt="Clarivue Logo" width="120" height="120">
  
  **Advanced Interview Analytics and Student Readiness Dashboard**
  
  [![Built with Encore](https://img.shields.io/badge/Built%20with-Encore-blue)](https://encore.dev)
  [![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.3-blue)](https://tailwindcss.com)
</div>

## 🎯 Overview

Clarivue Intelligence is a comprehensive interview analytics platform designed to assess student readiness, track competency development, and provide actionable insights for educational institutions. The platform combines AI-powered analysis with intuitive visualizations to help advisors and educators make data-driven decisions.

## ✨ Key Features

### 📊 **Analytics Dashboard**
- **Readiness Overview**: Real-time student readiness scores and trends
- **Competency Heatmap**: Visual representation of skill development across multiple dimensions
- **Analytics Summary**: Key performance indicators and metrics
- **Feedback Summary**: Aggregated insights from interview sessions

### 👥 **Student Management**
- **Student Profiles**: Comprehensive student information and progress tracking
- **Readiness Index**: Dynamic scoring system for student preparedness
- **Interview Insights**: AI-powered analysis of interview performance
- **Progress Tracking**: Historical data and improvement trends
- **Recommendations**: Personalized suggestions for student development

### 🎓 **Advisor Tools**
- **Advisor Dashboard**: Centralized view of assigned students
- **Student Assignment**: Flexible student-advisor matching system
- **Performance Analytics**: Detailed insights into student progress
- **Intervention Tracking**: Monitor and measure intervention effectiveness

### 📈 **Reporting & Analytics**
- **Cohort Outcomes**: Group-level performance analysis
- **Readiness Trends**: Historical trend analysis and forecasting
- **Skill Gaps Mapping**: Identify areas for curriculum improvement
- **Intervention Impact**: Measure the effectiveness of support programs
- **Capacity Coverage**: Resource allocation and planning insights

### 🤖 **AI-Powered Features**
- **Interview Analysis**: Automated transcript analysis and insights
- **Competency Scoring**: Multi-dimensional skill assessment
- **Recommendation Engine**: Personalized improvement suggestions

## 🏗️ Architecture

This project is built using a modern, scalable architecture:

- **Backend**: [Encore.dev](https://encore.dev) - Type-safe backend framework
- **Frontend**: React 19 with TypeScript and Vite
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React icon library
- **Package Manager**: Bun for fast dependency management

## 🚀 Quick Start

### Prerequisites

- **Encore CLI**: Install the Encore development environment
  ```bash
  # macOS
  brew install encoredev/tap/encore
  
  # Linux
  curl -L https://encore.dev/install.sh | bash
  
  # Windows
  iwr https://encore.dev/install.ps1 | iex
  ```

- **Bun**: Install Bun for package management
  ```bash
  npm install -g bun
  ```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clarivue-OS
   ```

2. **Backend Setup**
   ```bash
   cd backend
   encore run
   ```
   The backend will be available at `http://localhost:4000`

3. **Frontend Setup**
   ```bash
   cd frontend
   bun install
   bun run dev
   ```
   The frontend will be available at `http://localhost:5173`

4. **Generate Frontend Client**
   ```bash
   cd backend
   encore gen client --target leap
   ```

## 📁 Project Structure

```
clarivue-OS/
├── backend/                 # Encore backend application
│   ├── frontend/           # Built frontend assets
│   ├── health/             # Health check services
│   └── package.json
├── frontend/               # React frontend application
│   ├── components/         # React components
│   │   ├── advisors/       # Advisor-related components
│   │   ├── charts/         # Data visualization components
│   │   ├── interview-reports/ # Interview analysis components
│   │   ├── reports/        # Reporting components
│   │   ├── students/       # Student management components
│   │   └── ui/            # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── data/              # Mock data and test data
│   ├── lib/               # Utility libraries
│   ├── public/            # Static assets
│   │   └── clarivue-favicon/ # Favicon system
│   ├── styles/            # Global styles and themes
│   ├── types.ts           # TypeScript type definitions
│   └── utils/             # Utility functions
├── package.json           # Root package configuration
└── README.md             # This file
```

## 🎨 Design System

The application uses a comprehensive design system built on:

- **Tailwind CSS 4**: Modern utility-first CSS framework
- **Custom CSS Variables**: Theme-aware color system
- **Radix UI**: Accessible component primitives
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Automatic theme switching support

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
```

**Backend:**
```bash
encore run       # Start Encore development server
encore gen client --target leap  # Generate frontend client
```

### Code Organization

- **Components**: Organized by feature area (students, advisors, reports)
- **Types**: Centralized TypeScript definitions
- **Utils**: Reusable utility functions and helpers
- **Styles**: Global styles and theme configuration
- **Data**: Mock data for development and testing

## 🚀 Deployment

### Encore Cloud Platform

1. **Login to Encore Cloud**
   ```bash
   encore auth login
   ```

2. **Add Git Remote**
   ```bash
   git remote add encore encore://clarivue-interview-dashboard-9x5i
   ```

3. **Deploy**
   ```bash
   git add -A .
   git commit -m "Deploy to Encore Cloud"
   git push encore
   ```

### GitHub Integration (Recommended)

1. Connect your GitHub account in the [Encore Cloud dashboard](https://app.encore.cloud/clarivue-interview-dashboard-9x5i/settings/integrations/github)
2. Push to your repository for automatic deployments:
   ```bash
   git add -A .
   git commit -m "Deploy via GitHub"
   git push origin main
   ```

### Self-hosting

See the [Encore self-hosting documentation](https://encore.dev/docs/self-host/docker-build) for Docker deployment instructions.

## 📊 Data Models

### Core Entities

- **Student**: Individual student profiles with readiness metrics
- **Advisor**: Faculty members managing student progress
- **Interview Report**: Detailed analysis of interview sessions
- **Competency**: Skill areas being assessed
- **Recommendation**: AI-generated improvement suggestions

### Key Metrics

- **Readiness Score**: Overall preparedness assessment (0-100)
- **Competency Ratings**: Individual skill assessments
- **Improvement Trends**: Progress tracking over time
- **Confidence Levels**: Self-assessment and observed confidence
- **Interview Performance**: Session-specific analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Encore Documentation**: [https://encore.dev/docs](https://encore.dev/docs)
- **Encore Cloud Dashboard**: [https://app.encore.dev](https://app.encore.dev)
- **Deployment Guide**: [https://encore.dev/docs/platform/deploy/deploying](https://encore.dev/docs/platform/deploy/deploying)

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [Encore documentation](https://encore.dev/docs)
- Visit the [Encore community forum](https://github.com/encoredev/encore/discussions)

---

<div align="center">
  <p>Built with ❤️ using <a href="https://encore.dev">Encore</a> and <a href="https://reactjs.org">React</a></p>
</div>
