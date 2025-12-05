import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (data) => {
  const { fullName, email, password, role } = data;
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email đã được sử dụng');

  const user = new User({ fullName, email, password, role });
  try{
    await user.save();
  }
  catch(err){
    console.log('Lỗi khi lưu người dùng:', err);
    throw err;
  }

  return { message: 'Đăng ký thành công', user };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Không tìm thấy tài khoản');

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Sai mật khẩu');

  // Tạo token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return { token, user: { id: user._id, email: user.email, role: user.role } };
};
