// import { GoogleGenerativeAI } from "@google/generative-ai";

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests to the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/policies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'policies.html'));
});

app.get('/awareness', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'awareness.html'));
});

// New route for /solutions
app.get('/solutions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});


app.get('/chatbot-answer', (req, res) => {
    const userInput = req.query.userInput;
    console.log('User Input:', userInput);
    
    // Always respond with "siuu"
    res.send("yash");
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
