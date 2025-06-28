const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');             // Shtojmë për server HTTP
const { Server } = require('socket.io');  // Shtojmë Socket.IO

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

// Krijojmë serverin HTTP dhe lidhe Socket.IO me të
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // në prodhim specifiko domain-in e frontend-it për siguri
    methods: ['GET', 'POST'],
  }
});

// Event për kur një klient lidhet
io.on('connection', (socket) => {
  console.log('Një klient u lidh:', socket.id);

  socket.on('disconnect', () => {
    console.log('Klienti u shkëput:', socket.id);
  });
});

// ================= USERS =================
// Regjistrimi i përdoruesve
app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
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

    res.json({ 
      message: 'Hyrje e suksesshme!',
      role: user.role
    });
  });
});
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Të dhënat mungojnë' });
  }

  const query = 'UPDATE users SET password = ? WHERE email = ?';
  db.query(query, [newPassword, email], (err, result) => {
    if (err) {
      console.error('Gabim nga databaza:', err);
      return res.status(500).json({ message: 'Gabim gjatë përditësimit të fjalëkalimit' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Emaili nuk ekziston' });
    }

    res.status(200).json({ message: 'Fjalëkalimi u ndryshua me sukses' });
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

// ================= CONTACT US =================

// Shto mesazh të ri dhe dërgo notifikim për adminin në kohë reale
app.post('/contact', (req, res) => {
  const { emri, email, message } = req.body;
  const query = 'INSERT INTO contact (emri, email, message) VALUES (?, ?, ?)';

  db.query(query, [emri, email, message], (err, result) => {
    if (err) {
      console.error('Gabim gjatë ruajtjes së mesazhit:', err);
      return res.status(500).json({ message: 'Gabim gjatë ruajtjes së mesazhit.' });
    }

    // Dërgojmë event në socket me të dhënat e mesazhit të ri
    io.emit('new_message', { id: result.insertId, emri, email, message });

    res.status(201).json({ message: 'Mesazhi u ruajt me sukses!' });
  });
});

// Merr të gjitha mesazhet nga tabela contact (për admin)
app.get('/admin/messages', (req, res) => {
  const query = 'SELECT * FROM contact ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gabim gjatë marrjes së mesazheve!' });
    }
    res.json(results);
  });
});


app.post('/orders', (req, res) => {
  const { name, location, phone, paymentMethod, items, total } = req.body;
  if (!name || !location || !phone || !paymentMethod || !items || !total) {
    return res.status(400).json({ message: 'Të dhënat e porosisë janë të paplota.' });
  }
  const sql = `
    INSERT INTO orders 
    (name, location, phone, paymentMethod, items, total) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, location, phone, paymentMethod, JSON.stringify(items), total], (err, result) => {
    if (err) {
      console.error('Gabim gjatë ruajtjes së porosisë:', err); // Ky do të tregojë saktë gabimin
      return res.status(500).json({ message: 'Gabim në server gjatë ruajtjes së porosisë.' });
    }
    res.status(201).json({ message: 'Porosia u ruajt me sukses.', orderId: result.insertId });
  });
});


app.get('/api/orders', (req, res) => {
  const sql = 'SELECT * FROM orders ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gabim gjatë marrjes së porosive:', err);
      return res.status(500).json({ message: 'Gabim në server gjatë marrjes së porosive.' });
    }

    try {

      const parsed = results.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }));
      res.json(parsed);
    } catch(parseErr) {
      console.error('Gabim gjatë parsimit të ushqimeve:', parseErr);
      res.status(500).json({ message: 'Gabim në server gjatë përpunimit të porosive.' });
    }
  });
});



app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orders WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: 'Gabim gjatë fshirjes!' });
    res.json({ message: 'Ushqimi u fshi me sukses!' });
  });
});


app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY date ASC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Gabim gjatë marrjes së eventeve:', err);
      return res.status(500).json({ message: 'Gabim gjatë marrjes së eventeve.' });
    }

    res.status(200).json(results);
  });
});


// POST - shto event
app.post('/events', (req, res) => {
  const { date, title, description } = req.body;

  if (!date || !title) {
    return res.status(400).json({ message: 'Date dhe Title janë të nevojshme' });
  }

  const query = 'INSERT INTO events (date, title, description) VALUES (?, ?, ?)';
  db.query(query, [date, title, description || ''], (err, result) => {
    if (err) {
      console.error('Gabim gjatë shtimit të eventit:', err);
      return res.status(500).json({ message: 'Gabim gjatë ruajtjes së eventit.' });
    }

    res.status(201).json
    ({ id: result.insertId, date, title, description });
  });
});


app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM events WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: 'Gabim gjatë fshirjes!' });
    res.json({ message: 'eventi  u fshi me sukses!' });
  });
});

app.listen(port, () => {
  console.log(`Serveri po funksionon në http://localhost:${port}`);
});