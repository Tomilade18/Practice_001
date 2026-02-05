import express, {Request, Response} from "express";
import userRouter from "./routes/user"
import { user } from "./utils/constants";
import mongoose from "mongoose";

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/practice")
.then(() => console.log("Connected to Database"))
.catch((err) => console.log(`Error: ${err.message}`));



app.use(express.json());
app.use(userRouter);



const PORT = 3000;





app.listen(PORT, () => {
    console.log(`server is running on http://localhost: ${PORT}`)
});