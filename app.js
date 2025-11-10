// ==========================
//  FESTIFY SERVER SETUP
// ==========================

const express = require('express');
const app = express();
const PORT = 3000;

// ==========================
//  VIEW ENGINE SETUP (EJS)
// ==========================
app.set('view engine', 'ejs');

// ==========================
//  STATIC FILES SETUP
// ==========================
// This makes everything inside "public" accessible (CSS, JS, Images, etc.)
app.use(express.static('public'));

// ==========================
//  ROUTES
// ==========================

// Home Page Route
app.get('/', (req, res) => {
  const products = [
    { name: 'Diwali Diyas', price: 199, image: '/images/diya.jpg' },
    { name: 'Holi Colors Pack', price: 249, image: '/images/colors.jpg' },
    { name: 'Christmas Tree', price: 799, image: '/images/tree.jpg' }
  ];
  res.render('index', { products }); // Render views/index.ejs with data
});

// ✅ Admin Dashboard Route
app.get('/admin', (req, res) => {
  // This will render views/admin.ejs
  res.render('admin');
});

// ==========================
//  SERVER START
// ==========================
app.listen(PORT, () => {
  console.log(`🎉 Festify server running on http://localhost:${PORT}`);
});
