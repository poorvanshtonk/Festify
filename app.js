// ==========================
//  FESTIFY SERVER SETUP
// ==========================
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = 3000;

// ==========================
//  MIDDLEWARE SETUP
// ==========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
//  SESSION SETUP
// ==========================
app.use(
  session({
    secret: 'festify-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// ==========================
//  GLOBAL CART COUNT (NAVBAR USE)
// ==========================
app.use((req, res, next) => {
  res.locals.cartCount = req.session.cart
    ? req.session.cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  next();
});

// ==========================
//  SAMPLE PRODUCT DATA
// ==========================
const products = [
  { id: 1, name: 'Diwali Diyas', brand: 'Festify Lights', price: 199, image: '/images/diya.jpg' },
  { id: 2, name: 'Holi Colors Pack', brand: 'Festify Colors', price: 249, image: '/images/colors.jpg' },
  { id: 3, name: 'Christmas Tree', brand: 'Festify Decor', price: 799, image: '/images/tree.jpg' },
  { id: 4, name: 'Rangoli Powder Kit', brand: 'Festify Decor', price: 399, image: '/images/rangoli.jpg' },
  { id: 5, name: 'Festive Aroma Candles', brand: 'GlowCraft', price: 699, image: '/images/candles.jpg' },
];

// ==========================
//  ROUTES
// ==========================

// ✅ Home Page Route
app.get('/', (req, res) => {
  res.render('index', { products });
});

// ✅ Admin Dashboard Route
app.get('/admin', (req, res) => {
  res.render('admin');
});

// ✅ Profile Route
app.get('/profile', (req, res) => {
  res.render('profile');
});

// ✅ Cart Page Route (LIVE)
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartTotal > 999 ? 0 : 99;
  const discount = Math.round(cartTotal * 0.1); // 10% discount
  const finalTotal = cartTotal + deliveryFee - discount;

  const currentFestival = {
    name: 'Diwali',
    emoji: '🪔',
    colors: { gradient: 'linear-gradient(45deg, #ff512f, #dd2476)' },
  };

  const suggestedProducts = products
    .filter(p => !cart.some(c => c.id === p.id))
    .slice(0, 4);

  res.render('cart', {
    cart,
    cartTotal,
    deliveryFee,
    discount,
    finalTotal,
    currentFestival,
    suggestedProducts,
  });
});

// ✅ Add to Cart
app.post('/cart/add/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) return res.redirect('/');

  if (!req.session.cart) req.session.cart = [];

  const existingItem = req.session.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    req.session.cart.push({ ...product, quantity: 1 });
  }

  res.redirect('/cart');
});

// ✅ Remove from Cart
app.post('/cart/remove/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  req.session.cart = req.session.cart.filter(item => item.id !== productId);
  res.redirect('/cart');
});

// ✅ Update Quantity
app.post('/cart/update/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const action = req.query.action;
  const cartItem = req.session.cart.find(item => item.id === productId);

  if (cartItem) {
    if (action === 'increase') cartItem.quantity += 1;
    if (action === 'decrease' && cartItem.quantity > 1) cartItem.quantity -= 1;
  }

  res.redirect('/cart');
});

// ✅ Checkout (Placeholder)
app.get('/checkout', (req, res) => {
  res.send('<h1>🧾 Checkout Page Coming Soon!</h1>');
});

// ==========================
//  SERVER START
// ==========================
app.listen(PORT, () => {
  console.log(`🎉 Festify server running on http://localhost:3000`);
});
