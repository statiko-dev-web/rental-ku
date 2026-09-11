import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_CARS, DEFAULT_SETTINGS } from './src/defaultData.ts';

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB setup
function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  const initial = {
    cars: DEFAULT_CARS,
    settings: DEFAULT_SETTINGS,
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// Initialize db if not present
readDb();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // GET /api/cars
  app.get('/api/cars', (req, res) => {
    const db = readDb();
    res.json(db.cars || DEFAULT_CARS);
  });

  // POST /api/cars (Add car)
  app.post('/api/cars', (req, res) => {
    const db = readDb();
    const newCar = {
      id: `car-${Date.now()}`,
      ...req.body,
    };
    db.cars = [newCar, ...(db.cars || [])];
    writeDb(db);
    res.status(201).json(newCar);
  });

  // PUT /api/cars/:id (Update car)
  app.put('/api/cars/:id', (req, res) => {
    const db = readDb();
    const id = req.params.id;
    const index = db.cars.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Mobil tidak ditemukan' });
    }
    db.cars[index] = { ...db.cars[index], ...req.body };
    writeDb(db);
    res.json(db.cars[index]);
  });

  // DELETE /api/cars/:id
  app.delete('/api/cars/:id', (req, res) => {
    const db = readDb();
    const id = req.params.id;
    db.cars = db.cars.filter((c: any) => c.id !== id);
    writeDb(db);
    res.json({ success: true, id });
  });

  // GET /api/settings
  app.get('/api/settings', (req, res) => {
    const db = readDb();
    res.json(db.settings || DEFAULT_SETTINGS);
  });

  // POST /api/settings (Update settings)
  app.post('/api/settings', (req, res) => {
    const db = readDb();
    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    res.json(db.settings);
  });

  // POST /api/reset (Reset to seed defaults)
  app.post('/api/reset', (req, res) => {
    const resetData = {
      cars: DEFAULT_CARS,
      settings: DEFAULT_SETTINGS,
    };
    writeDb(resetData);
    res.json({ success: true, message: 'Data berhasil di-reset ke setelan awal pabrik.' });
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rental-in Indonesia server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
