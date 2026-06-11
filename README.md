# NavGuide - AI Educational Mentor

NavGuide is an AI-powered educational mentor application designed to help students track their education, improve skills, and receive personalized guidance on exams and colleges based on their grades and interests.

This repository contains the complete frontend architecture and onboarding system.

## Project Structure

```text
navguide/
│
├── client/              # React Frontend (Vite)
│   ├── public/          # Static assets
│   └── src/
│       ├── assets/      # Media & icon resources
│       ├── components/
│       │   └── UI/      # Glassmorphic UI library (Card, Input, Button)
│       ├── context/     # AuthContext (state retention, mock database)
│       ├── hooks/       # useAuth hook
│       ├── pages/       # Login, Signup (multi-step), and Dashboard pages
│       ├── routes.jsx   # Public/Protected route guards
│       ├── App.jsx      # App entry frame & background blobs
│       └── index.css    # Tailwind CSS v4 directives & theme configurations
│
├── server/              # Backend Placeholder (Node.js)
├── database/            # Database schema placeholder
├── docs/                # Project documentation placeholder
├── package.json         # Root workspace shortcuts
└── README.md            # Project description
```

## Color Hunt Theme Palette

We have integrated the requested **Color Hunt** theme palette:
- **Cream** (`#fff6de`): Applied to primary typography and card content.
- **Mint** (`#8bdfdd`): Core brand accent for highlights, focus borders, active chips, and progress bars.
- **Coral** (`#f48f68`): Secondary brand accent for errors, warnings, outline buttons, and highlights.
- **Sand** (`#ffe394`): Secondary brand highlight for AI mentor dialog titles and sliders.

Combined with a futuristic backdrop-blur glassmorphism (`backdrop-filter`) and deep dark colors (`#0b0f17`), it creates a vibrant yet assistive dark-themed layout.

## Onboarding Features

1. **Login Page**:
   - Floating error validations.
   - Show/hide password capability.
   - Simulated AI networking loading cycles ("Establishing secure link...").
2. **Signup Onboarding (4 Steps)**:
   - **Step 1 (Basic Info)**: Form validations for name, email, and password.
   - **Step 2 (Academic Info)**: Score parsing and grade validation, level and stream configs.
   - **Step 3 (Interests & Goals)**: Multi-select interactive interest chips and text entry for career aspirations.
   - **Step 4 (Preferences)**: College classification selections, a custom budget slider, and location inputs.
   - **Interactive AI Mentor Sidebar**: AI Advisor bubble displaying context-sensitive instruction cards and tips.
   - **State Recovery**: Syncs state to `localStorage` on change. Refreshes will return the student to their active step without losing form data.
3. **Dashboard Page**:
   - Custom-greeted dashboards parsing demographic info, interest vectors, and college budgets.
   - Generates an immediate personalized action plan of task lists.
   - Profile sign-out functionality.

## Getting Started

### Prerequisites

- **Node.js**: `v18+` or `v24+`
- **npm**: `v9+` or `v11+`

### Installation & Run

1. Clone or navigate to the project directory.
2. Run standard client server in the root of the workspace:

```bash
npm run dev
```

This command runs Vite inside `client/` and automatically binds to `http://localhost:5173`.
