const mongoose = require('mongoose');

// Схема для платежей
const PaymentSchema = new mongoose.Schema({
  // ID пользователя, который совершил платеж
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Email пользователя, который совершил платеж
  email: { type: String, required: true },
  // Сумма платежа
  amount: { type: Number, required: true },
  // Дата платежа
  paymentDate: { type: Date, default: Date.now },
});

// Модель для работы с платежами
export default mongoose.model('Payment', PaymentSchema);

