# User Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing users with role-based access control (RBAC).

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with role-based access control
- 👥 **User Management** - Create, read, update, and delete users
- 🎭 **Role-Based Access** - Three roles: Admin, Manager, and User with different permissions
- 📊 **Dashboard** - Interactive dashboards with statistics and charts
- 📈 **Analytics** - Growth trajectory charts and role distribution visualization
- 📝 **Activity Logs** - Track all user activities and system events
- 🔔 **Notifications** - Real-time notification system
- 🌙 **Dark Theme** - Modern dark theme UI
- 📤 **Export** - Export reports and activity logs to CSV
- 🔍 **Search & Filter** - Advanced search and filtering capabilities

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/kamalmudgil02/User-Management-System.git
cd User-Management-System
```

### 2. Install server dependencies
```bash
cd server
npm install
```

### 3. Install client dependencies
```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Credentials

After seeding the database, you can login with:

- **Super Admin**
  - Email: superadmin@example.com
  - Password: admin123

- **Manager**
  - Email: manager@example.com
  - Password: manager123

- **User**
  - Email: user1@example.com
  - Password: user123

## Project Structure

```
User-Management-System/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validation
│   └── server.js
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin/Manager)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/activity` - Get activity logs
- `PUT /api/users/:id/password` - Change password

## Roles & Permissions

### Admin
- Full system access
- Create, read, update, delete all users
- View all activity logs
- Access system settings
- Export reports

### Manager
- View and manage users (except admins)
- View activity logs
- Export reports
- Update own profile

### User
- View own profile
- Update own profile
- Change own password
- View roles and permissions

## Features in Detail

### Dashboard
- User statistics (total, active, inactive)
- Role distribution pie chart
- Growth trajectory bar chart
- Recent activity feed
- Quick actions

### User Management
- Advanced search and filtering
- Bulk operations
- User detail view
- Edit user modal
- Status management

### Activity Logs
- Real-time activity tracking
- Filter by action type
- Export to CSV
- Detailed audit trail

### Profile Management
- Update personal information
- Change password
- Avatar upload
- Account settings

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- XSS protection

## Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: user-management-api
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `JWT_EXPIRES_IN`: 7d
   - `CLIENT_URL`: Your Netlify URL (add after frontend deployment)
7. Click "Create Web Service"
8. Copy your Render URL (e.g., `https://your-app-name.onrender.com`)

### Deploy Frontend to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: client
   - **Build command**: `npm run build`
   - **Publish directory**: client/dist
5. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://your-app-name.onrender.com/api`)
6. Click "Deploy site"
7. After deployment, copy your Netlify URL
8. Go back to Render and update the `CLIENT_URL` environment variable with your Netlify URL

### Post-Deployment Steps

1. Update MongoDB Atlas Network Access to allow connections from Render (0.0.0.0/0 for all IPs)
2. Test the deployed application
3. Update the README with your live URLs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Kamal Mudgil
- GitHub: [@kamalmudgil02](https://github.com/kamalmudgil02)

## Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- Express.js for the backend framework
- Tailwind CSS for the styling system
