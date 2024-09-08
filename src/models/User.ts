const mongoose = require('mongoose');

// Схема для пользователей
const UserSchema = new mongoose.Schema({
  // Полное имя пользователя
  fullName: { type: String, required: true },
  // Номер телефона пользователя
  phoneNumber: { type: String, required: true },
  // Email пользователя
  email: { type: String, required: true, unique: true },
  // Пароль пользователя
  password: { type: String, required: true },
  // Список уроков, которые пользователь прошел
  lessons: { type: Array, default: [] },
  // ID пользователя, который пригласил текущего пользователя
  referrerId: { type: String, required: true },
  // Список пользователей, приглашенных текущим пользователем
  referreredUsers: { type: Array, default: [] },
  // Список платежей, сделанных пользователем
  payments: { type: Array, default: [] },
  // Дата регистрации пользователя
  registeredAt: { type: Date, default: Date.now },
});

// Модель для работы с пользователями
export default mongoose.model('User', UserSchema);

