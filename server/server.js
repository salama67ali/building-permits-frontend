import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 9090;

app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static serving of uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Data files
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const usersPath = path.join(dataDir, 'users.json');
const docsPath = path.join(dataDir, 'documents.json');
const notificationsPath = path.join(dataDir, 'notifications.json');

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : fallback;
  } catch (e) {
    console.error('Failed reading', filePath, e);
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Seed admin user if missing
(function seedAdmin() {
  const users = readJson(usersPath, []);
  const hasAdmin = users.some(u => u.role === 'admin');
  if (!hasAdmin) {
    const passwordHash = bcrypt.hashSync('Admin@123', 10);
    users.push({
      id: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin'
    });
    writeJson(usersPath, users);
    console.log('Seeded default admin: admin@example.com / Admin@123');
  }
})();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${uuidv4()}`;
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${unique}-${safeOriginal}`);
  }
});
const upload = multer({ storage });

// Auth and Users
app.post('/api/register', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const users = readJson(usersPath, []);
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = { id: uuidv4(), username, email, passwordHash, role: role.toLowerCase() };
  users.push(user);
  writeJson(usersPath, users);
  return res.json({ message: 'Registered successfully', userId: user.id });
});

app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const users = readJson(usersPath, []);
  const user = users.find(u => u.email === email && u.role === role.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  return res.json({ message: 'Login ok', role: user.role, userId: user.id, username: user.username });
});

app.get('/api/users', (req, res) => {
  const users = readJson(usersPath, []).map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role }));
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !role) return res.status(400).json({ message: 'Missing fields' });
  const users = readJson(usersPath, []);
  if (users.some(u => u.email === email)) return res.status(400).json({ message: 'Email already exists' });
  const passwordHash = password ? bcrypt.hashSync(password, 10) : bcrypt.hashSync('Temp@123', 10);
  const user = { id: uuidv4(), username, email, passwordHash, role };
  users.push(user);
  writeJson(usersPath, users);
  res.json({ message: 'User created', id: user.id });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const users = readJson(usersPath, []);
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  if (email && email !== users[idx].email && users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  users[idx].username = username ?? users[idx].username;
  users[idx].email = email ?? users[idx].email;
  users[idx].role = role ?? users[idx].role;
  if (password) users[idx].passwordHash = bcrypt.hashSync(password, 10);
  writeJson(usersPath, users);
  res.json({ message: 'User updated' });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  let users = readJson(usersPath, []);
  const before = users.length;
  users = users.filter(u => u.id !== id);
  if (before === users.length) return res.status(404).json({ message: 'User not found' });
  writeJson(usersPath, users);
  res.json({ message: 'User deleted' });
});

// Notifications (simple stubs)
app.get('/api/notifications/unread/:userId', (req, res) => {
  const all = readJson(notificationsPath, []);
  const unread = all.filter(n => n.userId === req.params.userId && !n.viewed);
  res.json(unread);
});
app.put('/api/notifications/viewed/:id', (req, res) => {
  const all = readJson(notificationsPath, []);
  const idx = all.findIndex(n => n.notificationId === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  all[idx].viewed = true;
  writeJson(notificationsPath, all);
  res.json({ message: 'Marked as viewed' });
});

// Documents
function addDocument({ originalName, storedName, mimeType, size, uploadedByRole, uploadedByUserId, docType }) {
  const docs = readJson(docsPath, []);
  const doc = {
    id: uuidv4(),
    originalName,
    storedName,
    mimeType,
    size,
    url: `/uploads/${storedName}`,
    docType: docType || 'general',
    uploadedByRole,
    uploadedByUserId,
    status: 'submitted',
    createdAt: new Date().toISOString(),
  };
  docs.push(doc);
  writeJson(docsPath, docs);
  return doc;
}

app.post('/api/documents/upload', upload.single('file'), (req, res) => {
  const { role, userId, docType } = req.body;
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const doc = addDocument({
    originalName: req.file.originalname,
    storedName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedByRole: (role || '').toLowerCase(),
    uploadedByUserId: userId,
    docType: (docType || 'general').toLowerCase(),
  });
  res.json({ message: 'Uploaded', doc });
});

// Owner specific upload (alias)
app.post('/api/owner/upload-document', upload.single('file'), (req, res) => {
  const { userId, docType } = req.body;
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const doc = addDocument({
    originalName: req.file.originalname,
    storedName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedByRole: 'owner',
    uploadedByUserId: userId,
    docType: (docType || 'tor').toLowerCase(),
  });
  res.json({ message: 'Uploaded', doc });
});

// Consultant specific (compatible with existing frontend)
app.post('/api/consultant/upload-building-plan', upload.single('file'), (req, res) => {
  const { consultantId } = req.body;
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const doc = addDocument({
    originalName: req.file.originalname,
    storedName: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedByRole: 'consultant',
    uploadedByUserId: consultantId,
    docType: 'building-plan',
  });
  res.json({ message: 'Uploaded', doc });
});

// Consultant: fetch ToR documents (owners' submissions)
app.get('/api/consultant/tor-documents/:userId', (req, res) => {
  const docs = readJson(docsPath, []);
  const tor = docs.filter(d => d.docType === 'tor');
  res.json(tor);
});

// Generic fetch documents with optional filtering
app.get('/api/documents', (req, res) => {
  const { role, userId } = req.query;
  let docs = readJson(docsPath, []);
  // Simple role-based filtering; admin/engineer/government-board see all
  const r = (role || '').toLowerCase();
  if (r === 'owner' || r === 'consultant') {
    // Show all for simplicity; adjust to filter by ownership if needed
    // docs = docs.filter(d => d.uploadedByUserId === userId);
  }
  res.json(docs);
});

// Status endpoints
app.get('/api/status', (req, res) => {
  const docs = readJson(docsPath, []);
  const statuses = docs.map(d => ({ id: d.id, docType: d.docType, status: d.status, updatedAt: d.updatedAt || d.createdAt }));
  res.json(statuses);
});

app.put('/api/status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expected: submitted|under-review|approved|rejected
  if (!status) return res.status(400).json({ message: 'Missing status' });
  const docs = readJson(docsPath, []);
  const idx = docs.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Document not found' });
  docs[idx].status = status;
  docs[idx].updatedAt = new Date().toISOString();
  writeJson(docsPath, docs);
  res.json({ message: 'Status updated' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});