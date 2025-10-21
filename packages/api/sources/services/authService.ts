import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { settings } from '../settings/index.js';
import { User } from '../types/index.js';

// In-memory user storage (나중에 데이터베이스로 교체 가능)
const users: User[] = [];

// 초기 관리자 계정 생성
const initializeAdmin = async () => {
  const hashedPassword = await bcrypt.hash(settings.adminPassword, 10);
  users.push({
    id: '1',
    username: settings.adminUsername,
    password: hashedPassword,
    role: 'admin',
  });
};

initializeAdmin();

export const authService = {
  async login(username: string, password: string) {
    const user = users.find((u) => u.username === username);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      settings.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  },

  async createUser(username: string, password: string, role: 'admin' | 'user' = 'user') {
    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: String(users.length + 1),
      username,
      password: hashedPassword,
      role,
    };

    users.push(newUser);

    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };
  },
};
