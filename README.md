# Nigeria Planner Hub

A comprehensive platform for urban planners in Nigeria to connect, collaborate, and manage their professional activities.

## Features

- Member Directory
- Ethics Module
- Chat System
- Social Networking
- Professional Development
- Resource Sharing

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: JWT
- Real-time Communication: Socket.IO

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/afrinict/nitpabj.git
   cd nitpabj
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/nigeriaplannerhub
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   # Terminal 1 (Backend)
   npm run dev
   
   # Terminal 2 (Frontend)
   cd client
   npm run dev
   ```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 