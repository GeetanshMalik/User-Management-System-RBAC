# User Management System - Client

A modern, interactive React frontend for the User Management System with role-based access control.

## Features

- 🎨 Modern, clean UI with smooth animations
- 🔐 Role-based access control (Admin, Manager, User)
- 📱 Fully responsive design
- ⚡ Fast and optimized with Vite
- 🎭 Framer Motion animations
- 🎯 Tailwind CSS styling
- 🔍 Advanced filtering and search
- 📊 Interactive dashboards
- 🔔 Toast notifications
- ✨ Professional SaaS design

## Tech Stack

- React 19
- React Router DOM 7
- Framer Motion 12
- Tailwind CSS 4
- Lucide React (icons)
- Axios
- Vite 8

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## Features by Role

### Admin
- View dashboard with stats
- Create, edit, delete users
- Manage all user roles
- View user details
- Access all features

### Manager
- View dashboard with stats
- Edit non-admin users
- View user details
- Limited management access

### User
- View personal dashboard
- Update own profile
- Change password
- View own information

## UI Highlights

- **Login Page**: Animated authentication with form validation
- **Dashboards**: Role-specific with stats and quick actions
- **User Management**: Advanced table with filters, search, and pagination
- **User Forms**: Modal-based create/edit with validation
- **Profile Page**: Personal information and password management
- **Error Pages**: Beautiful 403 and 404 pages

## Design System

- **Colors**: Professional blue, green, red, gray palette
- **Typography**: Clear hierarchy with proper sizing
- **Spacing**: Consistent 4px/8px/16px/24px grid
- **Animations**: Smooth transitions and micro-interactions
- **Components**: Reusable buttons, badges, cards, forms

## Documentation

See [UI_DOCUMENTATION.md](./UI_DOCUMENTATION.md) for detailed UI documentation.

## License

MIT
