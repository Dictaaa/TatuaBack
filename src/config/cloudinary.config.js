// ============================================================
// TATUA · Upload Config — Local Storage (sin servicios externos)
// Las imágenes se guardan en /uploads dentro del proyecto
// npm install multer
// ============================================================
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Crear carpetas si no existen
const UPLOAD_DIRS = [
  'uploads/artists/hero',
  'uploads/artists/portfolio',
  'uploads/payments/receipts',
];
UPLOAD_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Storage factory ───────────────────────────────────────────
function makeStorage(folder) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      const ext    = path.extname(file.originalname).toLowerCase();
      cb(null, `${unique}${ext}`);
    },
  });
}

// ── File filter ───────────────────────────────────────────────
function imageFilter(req, file, cb) {
  const allowed = ['.jpg','.jpeg','.png','.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'), false);
}

function anyFilter(req, file, cb) {
  const allowed = ['.jpg','.jpeg','.png','.webp','.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Formato no permitido'), false);
}

// ── Multer instances ──────────────────────────────────────────
const uploadHero = multer({
  storage:  makeStorage('uploads/artists/hero'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const uploadPortfolio = multer({
  storage:  makeStorage('uploads/artists/portfolio'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadReceipt = multer({
  storage:  makeStorage('uploads/payments/receipts'),
  fileFilter: anyFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { uploadHero, uploadPortfolio, uploadReceipt };