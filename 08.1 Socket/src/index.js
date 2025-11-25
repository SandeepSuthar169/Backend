// import express from "express";
// import axios from "axios";
// import Redis from "ioredis";
// import http from "http";
// import { Server } from "socket.io";

// const app = express();

// const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Socket Connected", socket.id);

//     socket.on('message', (data) => {
//         io.emit('server-message', data)   // Broadcast to all the connected clients
//     })

// });

// const PORT = process.env.PORT ?? 8000;

// const redis = new Redis({
//   host: "localhost",
//   port: 6379,
// });

// app.get("/", (req, res) => {
//   res.json({ status: "success" });
// });

// app.use(express.static("./public"));

// app.use(async function (req, res, next) {
//   const key = `rate-limit`;
//   const value = await redis.get(key);

//   if (value === null) {
//     await redis.set(key, 0);
//     await redis.expire(key, 60);
//   }

//   if (value > 10) {
//     return res.status(429).json({
//       message: "Too many requests",
//     });
//   }

//   redis.incr(key);
//   next();
// });

// app.get("/books/total", async (req, res) => {
//   const cachedValue = await redis.get("totalPagesCount");

//   if (cachedValue) {
//     console.log("Cache Hit");
//     return res.json({ totalPages: Number(cachedValue) });
//   }

//   const response = await axios.get(
//     "https://api.freeapi.app/api/v1/public/books"
//   );

//   const totalPagesCount = response?.data?.data?.data?.reduce((acc, curr) => {
//     const pages = curr.volumeInfo?.pageCount ?? 0;
//     return acc + pages;
//   }, 0);

//   console.log("Cache Miss");
//   await redis.set("totalPagesCount", totalPagesCount);

//   return res.json({ totalPages: totalPagesCount });
// });

// httpServer.listen(PORT, () => console.log(`HTTP Server is running on PORT ${PORT}`));


import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// In-memory todo storage (use database in production)
let todos = [];
let nextId = 1;

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Send existing todos to newly connected client
  socket.emit('load-todos', todos);

  // Add new todo
  socket.on('add-todo', (data) => {
    const newTodo = {
      id: nextId++,
      text: data.text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    console.log('✅ Todo added:', newTodo);
    
    // Broadcast to all clients
    io.emit('todo-added', newTodo);
  });

  // Toggle todo completion
  socket.on('toggle-todo', (data) => {
    const todo = todos.find(t => t.id === data.id);
    if (todo) {
      todo.completed = !todo.completed;
      console.log('🔄 Todo toggled:', todo.id, '- Completed:', todo.completed);
      
      // Broadcast to all clients
      io.emit('todo-toggled', { id: todo.id, completed: todo.completed });
    }
  });

  // Delete todo
  socket.on('delete-todo', (data) => {
    const index = todos.findIndex(t => t.id === data.id);
    if (index !== -1) {
      const deleted = todos.splice(index, 1)[0];
      console.log('🗑️  Todo deleted:', deleted.id);
      
      // Broadcast to all clients
      io.emit('todo-deleted', { id: data.id });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Serve static files
app.use(express.static("./public"));

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "success",
    todos: todos.length,
    connections: io.engine.clientsCount
  });
});

const PORT = process.env.PORT ?? 8000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Todo app ready!`);
});