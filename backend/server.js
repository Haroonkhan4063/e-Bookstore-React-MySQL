const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "mysql-30e28c96-haroon-bookstore.j.aivencloud.com",
  port: 16019,
  user: "avnadmin",
  password: "AVNS_HuC9umr1Dnap-iduG_6",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false
  }
};

app.post('/api/signup', (req, res) => {
    const db = mysql.createConnection(dbConfig);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
        db.end();
        if(err) {
            return res.json({status: "Error", error: err.message});
        }
        return res.json({status: "Success"});
    });
});

app.post('/api/login', (req, res) => {
    const db = mysql.createConnection(dbConfig);
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        db.end();
        if(err) return res.json({status: "Error", error: err.message});
        if(data.length > 0) return res.json({status: "Success", user: data[0]});
        else return res.json({status: "Fail"});
    });
});

app.get('/api/books', (req, res) => {
    const db = mysql.createConnection(dbConfig);
    const sql = "SELECT * FROM books";
    db.query(sql, (err, data) => {
        db.end();
        if (err) return res.json({status: "Error", error: err.message});
        return res.json(data);
    });
});

app.post('/api/place-order', (req, res) => {
    const db = mysql.createConnection(dbConfig);
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
        db.end();
        if(err) {
            return res.json({status: "Error", error: err.message});
        }
        return res.json({status: "Success", orderId: data.insertId});
    });
});

app.listen(8081, () => {
    console.log("🚀 Server running on 8081");
});

module.exports = app;
