import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export const hashPassword = (password: string) => {
   const salt = bcrypt.genSaltSync(saltRounds);
   return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string) => {
   return bcrypt.compareSync(plain, hashed)
}

export const generateAccessToken = (userId: string, userName: string) => {
   return jwt.sign(
      { userId, userName },
      JWT_SECRET,
      { expiresIn: "15m" }
   );
};

export const generateRefreshToken = (userId: string, userName: string) => {
   return jwt.sign(
      { userId, userName },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
   );
};

export const verifyAccessToken = (token: string) => {
   try {
      return jwt.verify(token, JWT_SECRET);
   } catch (err) {
      return null;
   }
};

export const verifyRefreshToken = (token: string) => {
   try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
   } catch (err) {
      return null;
   }
};