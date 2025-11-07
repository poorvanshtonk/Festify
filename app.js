const express = require('express');
const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images)
app.use(express.static('public'));

// Route for home page
app.get('/', (req, res) => {
  const products = [
    { name: 'Diwali Diyas', price: 199, image: '/images/diya.jpg' },
    { name: 'Holi Colors Pack', price: 249, image: '/images/colors.jpg' },
    { name: 'Christmas Tree', price: 799, image: '/images/tree.jpg' }
  ];
  res.render('index', { products }); // Render index.ejs with data
});

// Start server
app.listen(PORT, () => {
  console.log(`Festify server running on http://localhost:${PORT}`);
});
