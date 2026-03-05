import { Router } from "express";
import { Request, Response } from "express";
import { checkSchema, matchedData } from "express-validator";
import { validationSchema } from "../../utils/validationSchema";
import { register, login, logout, getCurrentUser } from "./auth.conroller";
import { authenticateHybrid } from "./auth.middleware";

const router = Router();

// Register route
router.post("/api/auth/register", checkSchema(validationSchema), async (req: Request, res: Response) => {
    try {
        const data = matchedData(req);
        await register({ ...req, body: data } as Request, res);
    } catch (error) {
        res.status(500).json({ message: "Registration error", error });
    }
});

// Login route
router.post("/api/auth/login", checkSchema(validationSchema), async (req: Request, res: Response) => {
    try {
        const data = matchedData(req);
        await login({ ...req, body: data } as Request, res);
    } catch (error) {
        res.status(500).json({ message: "Login error", error });
    }
});

// Logout route (requires authentication)
router.post("/api/auth/logout", authenticateHybrid, (req: Request, res: Response) => {
    logout(req, res);
});

// Get current authenticated user (requires authentication)
router.get("/api/auth/me", authenticateHybrid, (req: Request, res: Response) => {
    getCurrentUser(req, res);
});

export default router;