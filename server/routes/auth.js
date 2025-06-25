const express = require('express');
const router = express.Router();

// Basit kullanıcı veritabanı (gerçek uygulamada MongoDB kullanılır)
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    email: 'admin@company.com'
  }
];

// Giriş
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
  }
});

// Kullanıcı bilgileri
router.get('/profile', (req, res) => {
  // Mock kullanıcı bilgisi
  res.json({
    id: 1,
    username: 'admin',
    role: 'admin',
    email: 'admin@company.com'
  });
});

module.exports = router; 