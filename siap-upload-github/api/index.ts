import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

app.get('/api/content', (req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.status(404).json({ error: 'Database file not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/content', (req, res) => {
  try {
    return res.json({ success: true, data: req.body });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default app;
