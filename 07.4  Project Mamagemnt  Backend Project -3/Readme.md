
# Project Management Backend 


This is Project Management System backend that provides  for managing projects, tasks, subTask, and user collaborations. The system includes user authentication, role-based access control.

## Features
- User Management: Registration, authentication, profile management
- User Authentication & Authorization: Secure user registration and login using JWT (JSON Web Tokens).

- Project Management: Full CRUD (Create, Read, Update, Delete) operations for task and subTask. 
- Task Management: Task creation, assignment, status tracking

- note management: projectNote, note content assigning, user cratedBy.  
## Tech Stack
- Runtime: Node.js

 - Framework: Express.js

 - Database: MongoDB with Mongoose ODM

 - Authentication: JSON Web Tokens (JWT)

 - Password Hashing: bcryptjs

 - Environment Variables: dotenv

 - CORS: cors

### Project Schema 
<img width="1579" height="1272" alt="image" src="https://github.com/user-attachments/assets/4b2ecbe1-941b-404a-8754-161edaaca3c8" />


###  Installation & Setup

1. Clone the repository

```bash
git clone URL....
cd Backend/07.4-Project-Management-Backend-Project-3
``` 
2. Clone the repository

```bash
npm install
```

3. Start the Server
```bash
npm run dev
npm start
```

## API Endpoints & Usage

Authentication Routes (`/api/auth`)
| Method | Endpoint    | Description                |
| :-------- | :------- | :------------------------- |
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user & get token |
| GET | `/profile` | Get user profile |
| POST | `/verify` | Verify a user |
| POST | `/logout` | Logout a user |
| POST | `/verificationiEmail` | verificationi Email a user |
| POST | `/refreshAccessToken` | refreshAccessToken tesing |

Note Routes (`/api/note`)
| Method | Endpoint    | Description                |
| :-------- | :------- | :------------------------- |
| POST | `/createNote/:userId/:projectId` | Register new Note in DB	|
| GET | `/getNotes/:projectId` | Fectch note Info |
| GET | `/getNotesById/:noteId` | Fectch note Id  Info |
| POST | `/updateNote/:noteId` | Update note |
| DELETE | `/deleteNote/:noteId` | Delete note |

Task Routes (`/api/task`)
| Method | Endpoint    | Description                |
| :-------- | :------- | :------------------------- |
| POST | `/createSubTask` | Add new sub task in DB	|
| GET | `/createSubTask` | Fectch sub task Info |
| POST | `/updateSubTask` | update sub task |
| DELETE | `/deleteSubTask` | Delete sub task |
| POST | `/createTask` | Crate new task in DB	|
| GET | `/getAllTask` | Get All task 	|
| GET | `/getTasksById` | Get task By Id 	|
| POST | `/updateTask` | Update task 	|
| DELETE | `/deleteTask` | Delete task 	|

