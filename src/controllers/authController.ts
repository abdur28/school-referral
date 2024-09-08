import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import bcyprt from 'bcrypt';

dotenv.config();

/**
 * Генерация токена
 * @param id - id пользователя
 * @returns токен
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

/**
 * Регистрация пользователя
 * @param req - request object
 * @param res - response object
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { fullName, phoneNumber, email, password, referrerId } = req.body;
  const salt = 10
  const hashedPassword = await bcyprt.hashSync(password, salt)
  const myReferrerId: string = uuidv4();
  try {
    const availableUser = await User.findOne({email: email})
    if (availableUser) {
      res.json({message: "Пользователь существует"})
    } else {
      const user = new User({ fullName, phoneNumber, email, password: hashedPassword, referrerId: myReferrerId });
      await user.save();

      const referrer = await User.findOne({ referrerId: referrerId });
      if (referrer) {
        referrer.referreredUsers.push({fullName: user.fullName, email: user.email});
        await referrer.save();
      }
      const token: string = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,  // Prevent access to the cookie from JavaScript
        secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
        maxAge: 60 * 60 * 1000  // 1 hour
      });

      // res.status(201).json(res.cookie);

      res.redirect('/');

      // res.json({ token });  // Send token back to the client
    }
  } catch (error) {
    res.status(500).json({ error: 'Регистрация пользователя не удалась' });
  }
};

/**
 * Вход
 * @param req - request object
 * @param res - response object
 */
export const signInUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const correctPassword: boolean = await bcyprt.compareSync(password, user.password);
    // res.status(200).json({ correctPassword });
    if (user && correctPassword) {
      const token: string = generateToken(user._id);
      res.cookie('token', token, {
        httpOnly: true,  // Prevent access to the cookie from JavaScript
        secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
        maxAge: 60 * 60 * 1000  // 1 hour
      });

      res.redirect('/');
    } else {
      res.status(401).json({ error: 'Неверный Email или Пароль' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Вход не удался' });
  }
};

/**
 * Выход
 * @param req - request object
 * @param res - response object
 */
export const signOutUser = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('user');
  res.redirect('/');
};

