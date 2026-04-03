const router = require('express').Router();
const Usage = require('../models/Usage');

// GET /api/usage?clientId=xxx
router.get('/', async (req, res) => {
  const { clientId } = req.query;
  if (!clientId) return res.status(400).json({ error: 'clientId required' });
  try {
    const usage = await Usage.findOne({ clientId }).lean();
    res.json({ count: usage?.count ?? 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/usage/increment
router.post('/increment', async (req, res) => {
  const { clientId } = req.body;
  if (!clientId) return res.status(400).json({ error: 'clientId required' });
  try {
    const usage = await Usage.findOneAndUpdate(
      { clientId },
      { $inc: { count: 1 }, $set: { lastUsed: new Date() } },
      { upsert: true, new: true }
    );
    res.json({ count: usage.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
