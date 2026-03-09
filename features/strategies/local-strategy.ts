// @ts-nocheck
import passport from "passport";
import LocalStrategy from "passport-local";
import { comparePassword } from "../../utils/helpers";
import { User } from "../../mongoose/schemas/user";

// Configure Passport Local Strategy for login
passport.use(new LocalStrategy.Strategy(
    {
        usernameField: "userName",
    },
    async (userName, password, done) => {
        try {
            // Find user by username
            const user = await User.findOne({ userName });
            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            // Verify password
            const isValidPassword = comparePassword(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: "Invalid password" });
            }

            // Return user if authentication successful
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Serialize user - store user ID in session
passport.serializeUser((user, done) => {
    const userId = user?._id?.toString?.();
    done(null, userId);
});

// Deserialize user - retrieve full user object from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;