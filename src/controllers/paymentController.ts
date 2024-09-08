import { promises } from 'dns';
import { Request, Response } from 'express';
import User from '../models/User';
import Payment from '../models/Payment';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
 
/**
 * Создает сессию оплаты
 * @param req - запрос
 * @param res - ответ
 */
export const makePayment =  async (req: Request, res: Response): Promise<void> =>  {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "English lessons"
                        },
                        unit_amount: 50 * 100
                    },
                    quantity: 1
                },
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Maths lessons"
                        },
                        unit_amount: 60 * 100
                    },
                    quantity: 1
                },
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Physics lessons"
                        },
                        unit_amount: 30 * 100
                    },
                    quantity: 1
                },
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Chemistry lessons"
                        },
                        unit_amount: 40 * 100
                    },
                    quantity: 1
                },
    
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/failed`,
        })
        res.redirect(session.url)
    } catch (error) {
        res.status(400).json({'error': 'failed'})
    }
}

/**
 * Получает чек
 * @param req - запрос
 * @param res - ответ
 */
export const getReceipt =  async (req: Request, res: Response): Promise<void> =>  {
    const user = JSON.parse(req.cookies.user)
    const email = user.email

    const lessons : any = [
        'English lessons',
        'Maths lessons',
        'Physics lessons',
        'Chemistry lessons'
    ]

    try {
        if (req.query.session_id) {
            const result = await stripe.checkout.sessions.retrieve(req.query.session_id)
            if (result) {
                const foundUser = await User.findOne({ email });
                if (foundUser) {
                    foundUser.payments.push({amount: result.amount_total});
                    foundUser.lessons.push(...lessons)
                    await foundUser.save();
                    // console.log(1)

                    const payment = new Payment({ email: foundUser.email, userId:foundUser.id, amount:result.amount_total });
                    // console.log(payment)
                    await payment.save();
                    // console.log(2)

                    for (const referreredUser of foundUser.referreredUsers) {
                        const user = await User.findOne({ email: referreredUser.email });
                        if (user) {
                            user.lessons.push(...lessons);
                            await user.save();
                        }
                    }
                    // console.log(3)
                }
            }
            res.render('success')
        } else {
            res.status(400).json({'error': 'No receipt'})
        }
    } catch (error) {
        res.status(400).json({'error': 'failed'})
    }
}

/**
 * Показывает страницу неудачной оплаты
 * @param req - запрос
 * @param res - ответ
 */
export const showFailedPayment =  (req: Request, res: Response): void => {
    res.render('failed')
}
