import { Request, Response, NextFunction, Router } from "express";
import session from "express-session";


const router = Router();

router.use(session({
  secret: 'your_secret_key', 
  resave: false,            
  saveUninitialized: false,  
  cookie: { secure: false }
}));

router.get("/api/auth", (req: Request, res: Response, next:NextFunction) => {

})