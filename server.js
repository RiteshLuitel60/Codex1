const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], sessions: [], trades: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    startingBalance: user.startingBalance,
  };
}

function auth(req, res, next) {
  const token = req.cookies.sessionToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return res.status(401).json({ error: 'Invalid session' });

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return res.status(401).json({ error: 'User not found' });

  req.user = user;
  next();
}

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, startingBalance } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const db = readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    password: hashed,
    startingBalance: Number(startingBalance) || 10000,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);
  res.status(201).json({ user: publicUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = uuidv4();
  db.sessions = db.sessions.filter((s) => s.userId !== user.id);
  db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  writeDb(db);

  res.cookie('sessionToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies.sessionToken;
  if (token) {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDb(db);
  }
  res.clearCookie('sessionToken');
  res.json({ ok: true });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.get('/api/trades', auth, (req, res) => {
  const db = readDb();
  const trades = db.trades
    .filter((t) => t.userId === req.user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ trades });
});

app.post('/api/trades', auth, (req, res) => {
  const { symbol, side, entry, exit, size, date, notes } = req.body;
  if (!symbol || !side || entry === undefined || exit === undefined || !size || !date) {
    return res.status(400).json({ error: 'Missing required trade fields' });
  }

  const pnl = (Number(exit) - Number(entry)) * Number(size) * (side === 'short' ? -1 : 1);

  const trade = {
    id: uuidv4(),
    userId: req.user.id,
    symbol: symbol.toUpperCase(),
    side,
    entry: Number(entry),
    exit: Number(exit),
    size: Number(size),
    date,
    notes: notes || '',
    pnl: Number(pnl.toFixed(2)),
    createdAt: new Date().toISOString(),
  };

  const db = readDb();
  db.trades.push(trade);
  writeDb(db);
  res.status(201).json({ trade });
});

app.delete('/api/trades/:id', auth, (req, res) => {
  const db = readDb();
  const before = db.trades.length;
  db.trades = db.trades.filter((t) => !(t.id === req.params.id && t.userId === req.user.id));

  if (db.trades.length === before) return res.status(404).json({ error: 'Trade not found' });
  writeDb(db);
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

ensureDb();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
