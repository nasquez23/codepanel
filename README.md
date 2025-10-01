# CodePanel

> A comprehensive educational platform for collaborative code learning, assignment management, and peer-to-peer knowledge sharing with gamification features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Overview

**CodePanel** is a modern educational platform designed for students and instructors to facilitate collaborative code learning. It combines features like code review, problem posting and solving, assignment management, and gamification to create an engaging learning environment.

The platform enables:

- **Students** to share code problems, get help from peers, complete assignments, and earn achievements
- **Instructors** to create and manage assignments, review submissions, and track student progress
- **Community** to collaborate, share knowledge, and compete on leaderboards

## Key Features

### Authentication & User Management

- Secure JWT-based authentication with refresh tokens
- Role-based access control (Student, Instructor, Admin)
- User profiles with skills, interests, and social links
- Profile picture upload to AWS S3

### Problem Posts & Q&A Forum

- Create and share coding problems with syntax highlighting
- Support for multiple programming languages (Java, Python, JavaScript, C++, etc.)
- Comment threads with reactions (likes/dislikes)
- Accept answers to mark solutions
- Filter by category, tags, and difficulty level
- Full-text search functionality

### Assignment Management

- Instructors can create assignments with due dates
- Students submit code solutions
- Code review and grading system
- Submission status tracking (pending, reviewed)

### Gamification System

- Points-based scoring system
- Multiple event types (submissions, reviews, comments, etc.)
- Difficulty multipliers (Beginner: 0.5x, Easy: 1x, Medium: 2x, Expert: 5x)
- Weekly, monthly, and all-time leaderboards
- Redis-cached leaderboard for performance
- Event-driven architecture using RabbitMQ

### Achievements

- Multiple achievement categories (Milestone, Streak, Social, Mastery)
- Progress tracking for each achievement
- Automatic achievement awarding
- Achievement notifications
- Visual achievement gallery

### Dashboard

- Student dashboard with submissions and activity
- Instructor dashboard with pending reviews
- Statistics and analytics
- Recent activity feed

### Real-time Notifications

- WebSocket-based real-time updates
- In-app notifications
- Unread count tracking

### Leaderboard

- Time-based rankings (weekly, monthly, all-time)
- Top performers podium
- User ranking and score display
- Rank icons

## Tech Stack

### Backend

- **Framework:** Spring Boot 3.5.4
- **Language:** Java 17
- **Security:** Spring Security with JWT
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Message Broker:** RabbitMQ 3
- **ORM:** Spring Data JPA / Hibernate
- **Storage:** AWS S3
- **WebSocket:** Spring WebSocket with STOMP
- **Build Tool:** Maven

### Frontend

- **Framework:** Next.js 15.4.5 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.1.0
- **State Management:** TanStack Query (React Query) 5.85.3
- **Styling:** Tailwind CSS 4
- **UI Components:** ShadCN UI
- **Syntax Highlighting:** React Syntax Highlighter
- **WebSocket Client:** STOMP.js & SockJS
- **HTTP Client:** Axios
- **Notifications:** Sonner

### DevOps & Infrastructure

- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (reverse proxy)
- **Database:** PostgreSQL with persistent volumes
- **Cache:** Redis
- **Message Queue:** RabbitMQ with management UI

<!-- ## ðŸ—ï¸ Architecture

CodePanel follows a microservices-inspired architecture with clear separation of concerns:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚   Next.js       â”‚â—„â”€â”€â”€â”€â–ºâ”‚   Nginx          â”‚
â”‚   Frontend      â”‚      â”‚   (Reverse Proxy)â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â–¼
                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                         â”‚   Spring Boot    â”‚
                         â”‚   Backend API    â”‚
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚             â”‚             â”‚
                    â–¼             â–¼             â–¼
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚PostgreSQLâ”‚  â”‚  Redis   â”‚  â”‚ RabbitMQ â”‚
            â”‚          â”‚  â”‚  Cache   â”‚  â”‚  Queue   â”‚
            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                â”‚
                                                â–¼
                                        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                        â”‚   Workers    â”‚
                                        â”‚ - Gamificationâ”‚
                                        â”‚ - Notificationsâ”‚
                                        â”‚ - Achievementsâ”‚
                                        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
``` -->

### Key Architectural Patterns

1. **Event-Driven Architecture**: Uses RabbitMQ for asynchronous event processing
2. **Caching Strategy**: Redis for high-performance data access
3. **WebSocket Communication**: Real-time bidirectional updates
4. **Repository Pattern**: Data access abstraction
5. **Service Layer**: Business logic separation

## Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 20** or higher
- **Maven 3.6+**
- **Docker & Docker Compose** (for containerized deployment)
- **PostgreSQL 16** (if running locally)
- **Redis 7** (if running locally)
- **RabbitMQ 3** (if running locally)
- **AWS Account** (for S3 storage)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/codepanel.git
cd codepanel
```

2. **Backend Setup:**

```bash
cd backend
cp src/main/resources/application.properties src/main/resources/secrets.properties
# Edit secrets.properties with your configuration
```

3. **Frontend Setup:**

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL
POSTGRES_DB=codepanel
POSTGRES_USER=codepanel_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=your_rabbitmq_password

# JWT
JWT_SECRET_KEY=your_secret_key_here
JWT_EXPIRATION=86400000
JWT_REFRESH_TOKEN_EXPIRATION=604800000

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket

# Application
APP_URL=http://localhost:3000
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

### Backend Configuration

Create `backend/src/main/resources/secrets.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/codepanel
spring.datasource.username=codepanel_user
spring.datasource.password=your_secure_password

# JWT
jwt.secret-key=your_secret_key_here
jwt.expiration=86400000
jwt.refresh-token-expiration=604800000
jwt.refresh-token-max-family-size=5

# AWS S3
aws.access-key-id=your_aws_access_key
aws.secret-access-key=your_aws_secret_key
aws.region=your_aws_region
aws.s3.bucket-name=your_s3_bucket

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# RabbitMQ
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=admin
spring.rabbitmq.password=your_password

# Application
app.url=http://localhost:3000
```

### Running with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672

### Running Locally

#### 1. Start Infrastructure

```bash
# PostgreSQL
docker run -d --name postgres -e POSTGRES_DB=codepanel -p 5432:5432 postgres:16-alpine

# Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine

# RabbitMQ
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management-alpine
```

#### 2. Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

#### 3. Run Frontend

```bash
cd frontend
npm run dev
```

<!-- ## ðŸ“ Project Structure

### Backend

```
backend/
â”œâ”€â”€ src/main/java/com/codepanel/
â”‚   â”œâ”€â”€ config/          # Configuration classes
â”‚   â”œâ”€â”€ controllers/     # REST API endpoints
â”‚   â”œâ”€â”€ models/          # Domain entities & DTOs
â”‚   â”œâ”€â”€ repositories/    # Data access layer
â”‚   â”œâ”€â”€ services/        # Business logic
â”‚   â””â”€â”€ security/        # Security filters
â””â”€â”€ src/main/resources/
    â”œâ”€â”€ application.properties
    â””â”€â”€ templates/       # Email templates
```

### Frontend

```
frontend/src/
â”œâ”€â”€ app/            # Next.js pages (App Router)
â”œâ”€â”€ components/     # Reusable components
â”œâ”€â”€ sections/       # Page sections
â”œâ”€â”€ contexts/       # React contexts
â”œâ”€â”€ hooks/          # Custom hooks
â”œâ”€â”€ services/       # API services
â”œâ”€â”€ types/          # TypeScript types
â””â”€â”€ lib/            # Utilities
``` -->

## Core Features

### Authentication & Authorization

- JWT access tokens (24-hour expiration)
- Refresh tokens (7-day expiration)
- HttpOnly cookies for security
- Role-based access control

### Problem Posts

- Code syntax highlighting
- Multiple language support
- Difficulty levels
- Comment threads with reactions
- Accept answer functionality

### Assignments

- Create and manage (instructors)
- Submit solutions (students)
- Grade with feedback
- Due date reminders

### Gamification

Points awarded:

- Submission Accepted: 10 Ã— difficulty
- Review Approved: 5 Ã— difficulty
- Comment Created: 1 point
- Comment Liked: 2 points
- Answer Accepted: 10 Ã— difficulty

### Achievements

Categories:

- **Milestone**: One-time accomplishments
- **Streak**: Consecutive activities
- **Social**: Community engagement
- **Mastery**: Skill demonstrations

## API Documentation

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Problem Posts

```
GET    /api/problem-posts
GET    /api/problem-posts/{id}
POST   /api/problem-posts
PUT    /api/problem-posts/{id}
DELETE /api/problem-posts/{id}
GET    /api/problem-posts/search
```

### Assignments

```
GET    /api/assignments
GET    /api/assignments/{id}
POST   /api/assignments
PUT    /api/assignments/{id}
DELETE /api/assignments/{id}
GET    /api/assignments/{id}/submissions
```

### Submissions

```
POST   /api/submissions
GET    /api/submissions/{id}
PUT    /api/submissions/{id}/review
```

### Comments

```
GET    /api/problem-posts/{id}/comments
POST   /api/problem-posts/{id}/comments
PUT    /api/problem-posts/{postId}/comments/{id}
DELETE /api/problem-posts/{postId}/comments/{id}
POST   /api/problem-posts/{postId}/comments/{id}/react
```

### Leaderboard

```
GET    /api/leaderboard/weekly
GET    /api/leaderboard/monthly
GET    /api/leaderboard/all-time
```

### Achievements

```
GET    /api/achievements
GET    /api/achievements/user
GET    /api/achievements/user/progress
```

### Notifications

```
GET    /api/notifications
GET    /api/notifications/unread/count
PUT    /api/notifications/{id}/read
PUT    /api/notifications/mark-all-read
```

### Profile

```
GET    /api/profile
PUT    /api/profile
POST   /api/profile/picture
GET    /api/profile/{userId}
```

## Database Schema

### Core Tables

- `users` - User accounts and profiles
- `problem_posts` - Coding questions
- `problem_post_comments` - Comments
- `assignments` - Instructor assignments
- `assignment_submissions` - Student submissions
- `submission_reviews` - Grades and feedback
- `achievements` - Achievement definitions
- `user_achievements` - Earned achievements
- `user_achievement_progress` - Progress tracking
- `score_events` - Gamification events
- `user_scores` - Weekly scores
- `notifications` - User notifications
- `categories` - Content categories
- `tags` - Tagging system
- `comment_reactions` - Likes/dislikes

<!-- ## WebSocket Events

Connect to `/ws` endpoint:

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  // User notifications
  stompClient.subscribe('/user/queue/notifications', callback);
  
  // Unread count
  stompClient.subscribe('/user/queue/unread-count', callback);
  
  // System announcements
  stompClient.subscribe('/topic/announcements', callback);
});
``` -->