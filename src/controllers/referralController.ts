import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import Payment from '../models/Payment';
import bcrypt from 'bcrypt';

/**
 * Главная страница
 * @param req - request object
 * @param res - response object
 */
export const homePage = (req: Request & { user?: any }, res: Response): void => {
  const user = JSON.parse(req.cookies.user || '{}');

  if (!user.referrerId) {
    res.redirect('/')
  } else {
    res.render('home', { user: user });
  }
};

/**
 * Форма регистрации
 * @param req - request object
 * @param res - response object
 */
export const registerPage = (req: Request, res: Response): void => {
  const referrerId = req.query.referrerId;
  res.render('register', { referrerId });
};

/**
 * Форма входа
 * @param req - request object
 * @param res - response object
 */
export const signInPage = (req: Request, res: Response): void => {
  res.render('signIn')
}

/**
 * Показать форму регистрации
 * @param req - request object
 * @param res - response object
 */
export const showRegisterForm = (req: Request, res: Response): void => {
  res.render('register');
};

/**
 * Генерация ссылки на регистрацию
 * @param req - request object
 * @param res - response object
 */
export const generateLink = (req: Request & { user?: any }, res: Response): void => {
  const user = JSON.parse(req.cookies.user)
  const referrerId = user.referrerId
  const link: string = `${req.protocol}://${req.get('host')}/register?referrerId=${referrerId}`;
  res.json({ link });
};

/**
 * Страница статистики
 * @param req - request object
 * @param res - response object
 */
export const showStatistics = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const user = JSON.parse(req.cookies.user)
  const email = user.email
  try {
    const user = await User.findOne({ email: email });
    // console.log(user)
    res.render('statistics', {  referreredUsers : user.referreredUsers, payments:user.payments });
  } catch (error) {
    res.render('statistics', { error: 'Failed to retrieve statistics', user: req.user });
  }
};

/**
 * Страница уроков
 * @param req - request object
 * @param res - response object
 */
export const showLessons = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const user = JSON.parse(req.cookies.user)
  const email = user.email
  try {
    const user = await User.findOne({ email: email });
    res.render('lessons', {  lessons : user.lessons });
  } catch (error) {
    res.render('lessons', { error: 'Failed to retrieve statistics', user: req.user });
  }
};

/**
 * Страница оплаты
 * @param req - request object
 * @param res - response object
 */
export const showPaymentForm = (req: Request & { user?: any }, res: Response): void => {
  const user = JSON.parse(req.cookies.user)
  res.render('payment', { user: user});
};


/**
 * Обработка оплаты
 * @param req - request object
 * @param res - response object
 */
export const processPayment = async (req: Request, res: Response): Promise<void> => {
  const { studentId, amount } = req.body;

  try {
    const payment = new Payment({ studentId, amount });
    await payment.save();
    res.redirect('/');  // Redirect to home page after payment
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

