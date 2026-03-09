import { Request, Response, NextFunction, Router } from "express";
import session from "express-session";
import { verifyAccessToken } from "../../utils/helpers";


const router = Router();

export const sesionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', 
  resave: false,            
  saveUninitialized: false,  
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: false // set to true in production with HTTPS
   }
});

// Hybrid authentication middleware - checks both session and JWT token
export const authenticateHybrid = (req: Request, res: Response, next: NextFunction) => {
  // Check if session exists and is authenticated via Passport
  if (req.session && (req.session as any).passport?.user) {
    return next();
  }

  // Check for JWT token in Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  
  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      // Attach user info from token to request
      (req as any).user = decoded;
      return next();
    }
  }

  // Neither session nor valid token found
  return res.status(401).json({ 
    message: "Unauthorized - Please login first" 
  });
};

// Optional: Middleware to require session only
export const requireSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && (req.session as any).passport?.user) {
    return next();
  }
  return res.status(401).json({ 
    message: "Session required - Please login" 
  });
};

// Optional: Middleware to require token only
export const requireToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      (req as any).user = decoded;
      return next();
    }
  }
  
  return res.status(401).json({ 
    message: "Invalid or missing token" 
  });
};