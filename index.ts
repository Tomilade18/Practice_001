import express, {Request, Response} from "express";
import userRouter from "./routes/user"
import authRouter from "./features/auth/auth.routes"
import { sesionMiddleware } from "./features/auth/auth.middleware";
import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/practice")
.then(() => console.log("Connected to Database"))
.catch((err) => console.log(`Error: ${err.message}`));

const app = express();

// Middleware
app.use(express.json());

// Session middleware - must be before routes
app.use(sesionMiddleware);

// Routes
app.use(authRouter);
app.use(userRouter);

// Health check route
app.get("/health", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});