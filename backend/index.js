const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3012;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ff',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Lidhja me bazën e të dhënave është e suksesshme!');
});

// ================= USERS =================
// Regjistrimi i përdoruesve
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Default role is "user" if not provided
  const userRole = role || 'user'; 

  const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, password, userRole], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Ka ndodhur një gabim!' });
    }
    res.status(201).json({ message: 'Përdoruesi u regjistrua me sukses!' });
  });
});

// Login për përdoruesit dhe admin
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(400).json({ message: 'Përdoruesi nuk u gjet!' });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(400).json({ message: 'Fjalëkalimi është i gabuar!' });
    }

    // Kthejmë të dhënat e përdoruesit përfshirë rolin
    res.json({ 
      message: 'Hyrje e suksesshme!',
      role: user.role // Dërgojmë rolin e përdoruesit
    });
  });
});

// ================= FOODS =================

// Merr të gjitha ushqimet
app.get('/foods', (req, res) => {
  const query = 'SELECT * FROM food_items';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim gjatë marrjes së të dhënave!' });
    res.json(results);
  });
});

// Shto ushqim të ri
app.post('/foods', (req, res) => {
  const { name, description, price, image_url } = req.body;
  const query = 'INSERT INTO food_items (name, description, price, image_url) VALUES (?, ?, ?, ?)';
  db.query(query, [name, description, price, image_url], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gabim gjatë shtimit!' });
    res.status(201).json({ message: 'Ushqimi u shtua me sukses!' });
  });
});

// Përditëso ushqim ekzistues
app.put('/foods/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;
  const query = 'UPDATE food_items SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?';
  db.query(query, [name, description, price, image_url, id], (err) => {
    if (err) return res.status(500).json({ message: 'Gabim gjatë përditësimit!' });
    res.json({ message: 'Ushqimi u përditësua me sukses!' });
  });
});

// Fshi ushqim
app.delete('/foods/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM food_items WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: 'Gabim gjatë fshirjes!' });
    res.json({ message: 'Ushqimi u fshi me sukses!' });
  });
});

app.listen(port, () => {
  console.log(`Serveri po funksionon në http://localhost:${port}`);
});
