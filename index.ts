import express, {Request, Response} from "express";
import userRouter from "./routes/user"
import { user } from "./utils/constants";

const app = express();


app.use(express.json());
app.use(userRouter);



const PORT = 3000;





app.listen(PORT, () => {
    console.log(`server is running on http://localhost: ${PORT}`)
});