// middleware, который проверяет, является ли пользователь аутентифицированным
// если да, то добавляет информацию о пользователе в req.user
// если нет, то.redirect на страницу входа

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import User from '../models/User';
import { json } from 'stream/consumers';

dotenv.config();

// тип для payload токена
interface JwtPayload {
  id: string;
}

const protect = async (req: Request & { user?: any }, res: Response, next: NextFunction): Promise<void> => {
  // получаем токен из cookies
  const token = req.cookies.token;
  // если токена нет, то редиректим на страницу входа
  if (!token) {
    return res.status(401).redirect('/sign-in');
  }

  try {
    // верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    // находим пользователя по id из токена
    const user:any = await User.findById(decoded.id).select('fullName email referrerId -_id');
    // добавляем информацию о пользователе в req.user
    // и создаем cookie с информацией о пользователе
    res.cookie('user', JSON.stringify(user), {
      httpOnly: true,  // Prevent access to the cookie from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
    })
    // если все ок, то вызываем next()
    next();
  } catch (error) {
    // если что-то пошло не так, то редиректим на страницу входа
    return res.status(401).redirect('/sign-in');
  }
};

export default protect;



