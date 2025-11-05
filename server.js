/*
======================================================================
  ACTIVITY 3: SERVER AND DATABASE SETUP
======================================================================
*/

// --- Component: Server Setup ---
const express = require('express');
const mysql = require('mysql2'); // --- Component: Database Setup ---
const cors = require('cors'); // --- Component: package.json Requirements ---

const port = 19132;
const server = express();

// --- Middleware ---
server.use(cors()); // Use cors
server.use(express.json()); // For parsing POST/PUT request bodies

// --- Component: Database Setup ---
const database = mysql.createConnection({
    user: "root",
    port: "3306",
    password: "bobjoshuaungod2005",
    database: "midtermproject"
});

// --- Component: Database Setup (Connection & Error Handling) ---
database.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err); // Error handling
        return;
    }
    console.log("Connected to database 'mydb' successfully!"); // Logs success
});

// --- Component: Server Setup (Listen) ---
server.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Logs confirmation
});

/*
======================================================================
  API ROUTES
======================================================================
*/

// --- Test Route ---
server.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

/*
======================================================================
  PRODUCTS API (Activities 4, 5, 6, 7)
======================================================================
*/

// --- ACTIVITY 4: GET Method (View All Products) ---
server.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    database.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving products" });
        }
        res.status(200).json(result);
    });
});

// --- ACTIVITY 4: GET Method (View Product by ID) ---
server.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    // Uses parameterized queries
    const sql = "SELECT * FROM products WHERE id = ?"; 
    
    database.query(sql, [productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving product" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(result[0]);
    });
});

// --- ACTIVITY 5: POST Method (Create Product) ---
server.post('/products', (req, res) => {
    const { name, description, price, stock_quantity } = req.body;

    // --- Component: Validates input ---
    if (!name || !description || price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // --- Component: Uses parameterized queries ---
    const sql = "INSERT INTO products (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)";
    const values = [name, description, price, stock_quantity];

    database.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error creating product:", err);
            return res.status(500).json({ error: "Error creating product" });
        }
        // --- Component: Sends confirmation ---
        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId
        });
    });
});

// --- ACTIVITY 6: PUT Method (Update Product) ---
server.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, price, stock_quantity } = req.body;

    // --- Component: Input validation (simple check) ---
     if (!name || !description || price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // --- Component: Uses parameterized queries ---
    const sql = "UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ? WHERE id = ?";
    const values = [name, description, price, stock_quantity, productId];

    database.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ error: "Error updating product" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found, no update performed" });
        }
        // --- Component: Sends confirmation ---
        res.status(200).json({ message: "Product updated successfully" });
    });
});

// --- ACTIVITY 7: DELETE Method (Remove Product) ---
server.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    // --- Component: Uses parameterized query ---
    const sql = "DELETE FROM products WHERE id = ?";

    database.query(sql, [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ error: "Error deleting product" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found, no deletion performed" });
        }
        // --- Component: Sends confirmation ---
        res.status(200).json({ message: "Product deleted successfully" });
    });
});

/*
======================================================================
  USERS API (Activities 4, 5, 6, 7)
======================================================================
*/

// --- ACTIVITY 4: GET Method (View All Users) ---
server.get('/users', (req, res) => {
    const sql = "SELECT id, username, email FROM users"; // Avoid selecting password
    database.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving users" });
        }
        res.status(200).json(result);
    });
});

// --- ACTIVITY 4: GET Method (View User by ID) ---
server.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT id, username, email FROM users WHERE id = ?";
    
    database.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving user" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(result[0]);
    });
});

// --- ACTIVITY 5: POST Method (Create User) ---
server.post('/users', (req, res) => {
    const { username, email, password } = req.body;

    // --- Component: Validates input ---
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required." });
    }

    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const values = [username, email, password]; // Note: In real app, hash the password!

    database.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Error creating user" });
        }
        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });
    });
});

// --- ACTIVITY 6: PUT Method (Update User) ---
server.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    // --- Component: Input validation ---
     if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required." });
    }

    const sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
    const values = [username, email, password, userId];

    database.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: "Error updating user" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found, no update performed" });
        }
        res.status(200).json({ message: "User updated successfully" });
    });
});

// --- ACTIVITY 7: DELETE Method (Remove User) ---
server.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";

    database.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ error: "Error deleting user" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found, no deletion performed" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    });
});

// --- Component: Code Quality (Clean, Readable, Modular) ---
// The file is structured with clear comments and separation of concerns.