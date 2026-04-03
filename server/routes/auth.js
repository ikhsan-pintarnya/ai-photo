const router = require('express').Router();

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const { password } = req.body;
  const correct = process.env.ACCESS_PASSWORD;

  if (!correct) {
    return res.status(500).json({ error: 'ACCESS_PASSWORD not configured on server' });
  }

  if (password === correct) {
    return res.json({ valid: true });
  }

  return res.status(401).json({ valid: false, error: 'Incorrect password' });
});

module.exports = router;
