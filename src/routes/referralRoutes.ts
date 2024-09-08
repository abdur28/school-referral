import { Router } from 'express';
import { body } from 'express-validator';
import * as referralController from '../controllers/referralController';
import * as authController from '../controllers/authController';
import * as paymentController from '../controllers/paymentController'
import validateInput from '../middlewares/validateInput';
import protect from '../middlewares/authMiddleware';

const router: Router = Router();

// Главная страница
router.get('/', protect, referralController.homePage);

// Форма регистрации
router.get('/register',  referralController.registerPage);

// Форма входа
router.get('/sign-in', referralController.signInPage)

// POST /register - регистрация
router.post(
  '/register',  
  body('fullName').notEmpty(),
  body('phoneNumber').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('referrerId').optional(), 
  validateInput,
  authController.registerUser
)

// POST /sign-in - вход
router.post(
  '/sign-in',
  body('email').notEmpty(),
  body('password').notEmpty(),
  validateInput,
  authController.signInUser
)

// GET /sign-out - выход
router.get('/sign-out',protect, authController.signOutUser);

// POST /generate-link - генерация ссылки
router.post('/generate-link', protect, referralController.generateLink);

// GET /statistics - страница статистики
router.get('/statistics', protect, referralController.showStatistics);

// GET /lessons - страница уроков
router.get('/lessons', protect, referralController.showLessons);

// GET /payment - страница оплаты
router.get('/payment', protect, referralController.showPaymentForm);

// POST /payment - оплата
router.post(
  '/payment',
  protect,
  body('email').notEmpty(),
  body('fullName').notEmpty(),
  body('address').notEmpty(),
  validateInput,
  paymentController.makePayment
)

// GET /success - страница успешной оплаты
router.get('/success', paymentController.getReceipt);

// GET /failed - страница неудачной оплаты
router.get('/failed', paymentController.showFailedPayment);

export default router;

