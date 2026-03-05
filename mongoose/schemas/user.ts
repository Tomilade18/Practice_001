import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    userName: string;
    displayName?: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    userName: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,

    },

    displayName: mongoose.Schema.Types.String,

    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    }
})

export const User = mongoose.model<IUser>('User', UserSchema)