// ============================================================
// TATUA · Upload Controller — Local Storage
// ============================================================
const path   = require('path');
const fs     = require('fs');
const { Artist, Portfolio } = require('../models');

// URL base para servir las imágenes
const BASE_URL = process.env.API_URL || 'http://localhost:4000';

// Helper: convertir ruta local a URL pública
function toUrl(filePath) {
  // filePath ej: "uploads/artists/hero/123456.jpg"
  return `${BASE_URL}/${filePath.replace(/\\/g, '/')}`;
}

// Helper: borrar archivo del disco
function deleteFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.error('Error deleting file:', e);
  }
}

// Helper: extraer ruta relativa desde una URL
function urlToPath(url) {
  if (!url) return null;
  return url.replace(`${BASE_URL}/`, '').replace(/\//g, path.sep);
}

// ── POST /upload/hero ─────────────────────────────────────────
exports.uploadHero = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' });

    const artist = await Artist.findByPk(req.artist_id);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });

    // Borrar foto anterior si existe
    if (artist.hero_image_url) {
      deleteFile(urlToPath(artist.hero_image_url));
    }

    const url = toUrl(req.file.path);
    await artist.update({ hero_image_url: url });

    res.json({ message: 'Foto de perfil actualizada', hero_image_url: url });
  } catch (error) {
    console.error('Error uploading hero:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};

// ── DELETE /upload/hero ───────────────────────────────────────
exports.deleteHero = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.artist_id);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });

    deleteFile(urlToPath(artist.hero_image_url));
    await artist.update({ hero_image_url: null });

    res.json({ message: 'Foto eliminada' });
  } catch (error) {
    console.error('Error deleting hero:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};

// ── POST /upload/portfolio ────────────────────────────────────
exports.uploadPortfolio = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' });

    const { title, style_id, duration_hours } = req.body;
    const url = toUrl(req.file.path);

    const item = await Portfolio.create({
      artist_id:      req.artist_id,
      style_id:       style_id       || null,
      title:          title          || null,
      image_url:      url,
      duration_hours: duration_hours || null,
      is_active:      true,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error uploading portfolio:', error);
    res.status(500).json({ error: 'Error al subir imagen de portafolio' });
  }
};

// ── DELETE /upload/portfolio/:id ──────────────────────────────
exports.deletePortfolio = async (req, res) => {
  try {
    const item = await Portfolio.findOne({
      where: { id: req.params.id, artist_id: req.artist_id },
    });
    if (!item) return res.status(404).json({ error: 'Imagen no encontrada' });

    deleteFile(urlToPath(item.image_url));
    await item.destroy();

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};

// ── POST /upload/receipt ──────────────────────────────────────
exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

    res.json({
      message:     'Comprobante subido',
      receipt_url: toUrl(req.file.path),
    });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    res.status(500).json({ error: 'Error al subir el comprobante' });
  }
};