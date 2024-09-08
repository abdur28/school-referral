import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// функция-валидатор для проверки данных, полученных из запроса
const validateInput = (req: Request, res: any, next: NextFunction): void => {
  // получаем ошибки валидации
  const errors = validationResult(req);
  // если есть ошибки - отправляем ответ с ошибками
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // если ошибок нет - продолжаем выполнение программы
  next();
};

// экспортируем функцию-валидатор
export default validateInput;

