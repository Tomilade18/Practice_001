import { Request, Response, NextFunction } from "express";
import { user } from "./constants";

declare global {
  namespace Express {
    interface Request {
      findUser: number;
    }
  }
}

export const resolveIndexByUserId = (req:Request, res: Response, next: NextFunction ) =>{
    const { params: {id}} = req
    const parseId = parseInt(id);
    
    if(isNaN(parseId)) return res.sendStatus(400);
    
    const findUser = user.findIndex(u => u.id === parseId);
    
    if (findUser === -1) return res.sendStatus(404);

    req.findUser = findUser;
    next();
}