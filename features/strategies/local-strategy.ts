// @ts-nocheck
import passport from "passport";
import { Strategy } from "passport-local";
import { comparePassword } from "../../utils/helpers";
import { User } from "../../mongoose/schemas/user";

passport.serializeUser((user, done) => {
    const userId = user?._id?.toString?.();
    done(null, userId);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
})

export default passport.use(new Strategy(
     async (username, password, done)  => {
        try {
            const findUser = await User.findOne({userName: username});
            if (!findUser) throw new Error("User not found");
            if (!comparePassword(password, findUser.password)) throw new Error("Bad Credentials");
            done(null, findUser);
 
        } catch (err) {
            done(err);
        }
    }
));