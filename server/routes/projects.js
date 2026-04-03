const router = require('express').Router();
const Project = require('../models/Project');

// GET /api/projects?clientId=xxx
router.get('/', async (req, res) => {
  const { clientId } = req.query;
  if (!clientId) return res.status(400).json({ error: 'clientId required' });
  try {
    const projects = await Project.find({ clientId }).sort({ timestamp: -1 }).lean();
    res.json(projects.map((p) => ({ ...p, id: p._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  const { clientId, name, timestamp, sourceImage, features, generatedImages } = req.body;
  if (!clientId) return res.status(400).json({ error: 'clientId required' });
  try {
    const project = await Project.create({ clientId, name, timestamp, sourceImage, features, generatedImages });
    res.status(201).json({ ...project.toObject(), id: project._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id?clientId=xxx
router.delete('/:id', async (req, res) => {
  const { clientId } = req.query;
  if (!clientId) return res.status(400).json({ error: 'clientId required' });
  try {
    await Project.deleteOne({ _id: req.params.id, clientId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
