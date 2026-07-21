# 📚 Books World - Full Stack E-Commerce Platform

Welcome to **Books World**, a modern and responsive Full-Stack E-Commerce web application built using the MERN stack architecture (with MySQL as the database). This platform allows users to browse premium books, view details, manage their shopping cart, and place orders seamlessly.

🔗 **Live Demo:** [https://e-bookstore-react-my-sql.vercel.app/](https://e-bookstore-react-my-sql.vercel.app/)

---

## ✨ Key Features

* **User Authentication:** Secure Signup and Login system with password validation (min 8 characters + special symbols).
* **Modern UI/UX:** 
  * Glassmorphism design elements.
  * Interactive 3D floating background animations.
  * Smooth transitions and scroll effects.
* **Smart Shopping Cart:** 
  * Add to cart, increase/decrease quantity, and remove items.
  * Real-time total price calculation.
* **Quick View Modal:** Bootstrap-style popup modal to view book descriptions, authors, and high-quality images.
* **Dynamic Search & Filtering:** Filter books by categories (Programming, Islamic, Sci-Fi) or search by title.
* **Checkout System:** Billing details form with 'Confirm Order' and 'Cancel' functionality.
* **Database Management:** Fully integrated with MySQL to store users, books, and order details.

---

## 🛠️ Technologies Used

### **Frontend**
* **React.js** (Single Page Application)
* **Custom CSS3** (Flexbox, Grid, Animations, UI Styling)
* **FontAwesome** (Icons)

### **Backend**
* **Node.js** (Runtime Environment)
* **Express.js** (RESTful API architecture)

### **Database**
* **MySQL** (Relational Database Management System)

---

## 🚀 Installation & Setup Guide

Follow these steps to run the project locally on your machine.

### 1. Database Setup (MySQL)
1. Open your MySQL client (e.g., XAMPP/MySQL Workbench).
2. Create a new database named `bookstore_db`.
3. Run the SQL queries to create the `users`, `books`, and `orders` tables.
4. Insert the sample book data into the `books` table.

### 2. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
Install the required dependencies:

Bash
npm install
Start the Node.js server:

Bash
node server.js
(The server will run on http://localhost:8081)

3. Frontend Setup
Open a new terminal and navigate to the main directory:

Bash
cd frontend
Install the required dependencies:

Bash
npm install
Start the React application:

Bash
npm start
(The app will automatically open in your browser at http://localhost:3000)

📂 Project Structure
Plaintext
Books-World/
├── backend/             # Node.js & Express server files
│   ├── server.js        # Main API endpoints and DB connection
│   └── package.json     
├── public/              # Static assets and images
├── src/                 
│   ├── App.js           # Main React Component & Logic
│   ├── App.css          # Custom Styling & Animations
│   └── index.js         # App Entry Point
├── .gitignore           # Ignored files for GitHub
├── package.json         
├── vercel.json          # Vercel deployment configuration
└── README.md            # Project Documentation
👨‍💻 Developer
Developed by Muhammad Haroon Khan as a Full-Stack Web Development Project.
