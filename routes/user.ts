import { Router, Request, Response } from "express";
import { user } from "../utils/constants";
import { resolveIndexByUserId } from "../utils/middleware";
import {query, body, matchedData, validationResult, checkSchema} from "express-validator"
import { validationSchema } from "../utils/validationSchema";
import { User } from "../mongoose/schemas/user";
import { hashPassword } from "../utils/helpers";

const router = Router();


router.get("/api/user",(req: Request, res: Response) => {
    
    res.status(200).send(user);
});

router.get("/api/user/:id", resolveIndexByUserId, (req: Request, res: Response) => {
   const { findUser } = req;

    return res.send(user[findUser]);

});

router.post("/api/user", 
   checkSchema(validationSchema),
     (req: Request, res: Response) => {
    const { body } = req;
    const result = validationResult(req)
    console.log(result);

    const data = matchedData(req);
    data.password = hashPassword(data.password)

    const newUser = new User(data)

    newUser.save();
    return res.send(newUser);
})

router.put("/api/user/:id", resolveIndexByUserId, (req: Request, res: Response) => {
    const {
        body,
        findUser,
    } = req;

   
    user[findUser] = {
        ...user[findUser],
        ...body
    };


    return res.sendStatus(200);
})

router.patch("/api/user/:id", resolveIndexByUserId, (req:Request, res: Response) => {
    const {
        body,
        findUser,
    } = req;

     user[findUser] = {
        ...user[findUser],
        ...body,
    };

    return res.send(user[findUser]).status(200);
});

router.delete("/api/user/:id", resolveIndexByUserId, (req: Request, res: Response) => {
    const {
        body,
        findUser,
    } = req;

    user.splice(findUser, 1);
    return res.status(200).send(user)
})

export default router 