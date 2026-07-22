const fs = require('fs');
let text = fs.readFileSync('src/App.jsx', 'utf8');

// Separate App component into App, AppNavbar, HeroSection, AppFooter
// Look at function App()
let startApp = text.indexOf('function App() {');
