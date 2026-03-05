import { Request, Response } from "express";
import { comparePassword, hashPassword, generateAccessToken, generateRefreshToken } from "../../utils/helpers";
import { User } from "../../mongoose/schemas/user";

export const register = async (req: Request, res: Response) => {
    try {
        const { userName, password, displayName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password and create new user
        const hashedPassword = hashPassword(password);
        const newUser = new User({
            userName,
            password: hashedPassword,
            displayName: displayName || userName
        });

        await newUser.save();

        return res.status(201).json({ 
            message: "User registered successfully",
            user: { id: newUser._id, userName: newUser.userName }
        });
    } catch (error) {
        return res.status(500).json({ message: "Registration failed", error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body;

        // Find user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isValidPassword = comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create session
        (req.session as any).userId = user._id.toString();
        (req.session as any).userName = user.userName;

        // Generate JWT tokens
        const accessToken = generateAccessToken(user._id.toString(), user.userName);
        const refreshToken = generateRefreshToken(user._id.toString(), user.userName);

        // Return both session and tokens
        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id, userName: user.userName, displayName: user.displayName },
            accessToken,
            refreshToken,
            sessionCreated: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Login failed", error });
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed", error: err });
        }
        // Also clear session cookie
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
    });
};

export const getCurrentUser = (req: Request, res: Response) => {
    try {
        // Get user from session or token
        const userId = (req.session as any)?.userId || (req as any).user?.userId;
        const userName = (req.session as any)?.userName || (req as any).user?.userName;

        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        return res.status(200).json({
            user: { id: userId, userName }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching current user", error });
    }
};