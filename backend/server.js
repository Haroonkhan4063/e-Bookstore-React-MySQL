const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bookstore_db'
});

db.connect((err) => {
    if (err) console.log('❌ DB Error:', err);
    else console.log('✅ MySQL Connected!');
});

// --- 1. SIGNUP API ---
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, [values], (err, data) => {
        if(err) return res.json({status: "Error", error: err});
        return res.json({status: "Success"});
    });
});

// --- 2. LOGIN API ---
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json({status: "Error"});
        if(data.length > 0) return res.json({status: "Success", user: data[0]});
        else return res.json({status: "Fail"});
    });
});

// --- 3. GET BOOKS API ---
app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// --- 4. PLACE ORDER API (NEW) ---
app.post('/place-order', (req, res) => {
    // Items ko JSON string bana kar save karenge
    const itemsString = JSON.stringify(req.body.items); 
    
    const sql = "INSERT INTO orders (`customer_name`, `email`, `address`, `phone`, `total_price`, `items`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.address,
        req.body.phone,
        req.body.total,
        itemsString
    ];

    db.query(sql, [values], (err, data) => {
        if(err) {
            console.log(err);
            return res.json({status: "Error", error: err});
        }
        return res.json({status: "Success", orderId: data.insertId});
    });
});

app.listen(8081, () => {
    console.log("🚀 Server running on 8081");
});