import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create the Express app
const app = express();

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI("AIzaSyC71aIp7u9YeRa67G1ORzgPYXtJXDnRwqY");

function parseMarkdownToHTML(text) {
    // Replace markdown for bold and italics, and add line breaks
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Replace **text** with <strong>text</strong>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Replace *text* with <em>text</em>
        .replace(/\n/g, '<br>');                           // Replace newlines with <br>
}

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

// New route for the chatbot solution
app.get('/solution', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html')); // Ensure this points to your HTML file
});

// New route for handling chatbot input
app.get('/chatbot-answer', async (req, res) => {
    const userInput = req.query.userInput;
    console.log('User Input:', userInput);
    
    try {
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Generate a response based on user input
        const result = await model.generateContent(userInput);
        const response = await result.response;
        const text = await response.text(); // Make sure to await this
        console.log(text);
        const htmlResponse = parseMarkdownToHTML(text);
        
        // Send the generated text as a response
        res.send(htmlResponse);
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).send("Error generating response. Please try again.");
    }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
