# NavGuide Backend (Node.js/Express)

This folder is set aside for the NavGuide server API.

## Recommended Tech Stack

- **Node.js** + **Express**
- **SQLite** or **PostgreSQL** (via ORM like Prisma or Sequelize)
- **bcryptjs** (for password hashing)
- **jsonwebtoken** (for auth sessions)
- **OpenAI Node SDK** or **Google Gen AI SDK** (for AI mentoring endpoints)

## Planned Endpoints

- `POST /api/auth/signup` - Registers users and saves academic profiles.
- `POST /api/auth/login` - Validates credentials and returns JWT.
- `GET /api/user/profile` - Fetches authenticated student information.
- `POST /api/ai/chat` - Streams suggestions from the AI mentor.
