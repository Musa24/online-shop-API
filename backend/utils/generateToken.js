import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRET, { expiresIn: '1h' });
};

export default generateToken;
