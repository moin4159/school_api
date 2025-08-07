const db = require('../config/db');

function validateFields({ name, address, latitude, longitude }) {
  return name && address && !isNaN(latitude) && !isNaN(longitude);
}

// POST /addSchool
exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!validateFields({ name, address, latitude, longitude })) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'School added successfully', schoolId: result.insertId });
  });
};

// GET /listSchools?lat=12.9&lng=77.5
exports.listSchools = (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  const sql = 'SELECT *, SQRT(POW(latitude - ?, 2) + POW(longitude - ?, 2)) AS distance FROM schools ORDER BY distance ASC';
  db.query(sql, [userLat, userLng], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
