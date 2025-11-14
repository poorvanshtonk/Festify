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
//  GLOBAL CART COUNT (NAVBAR)
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
//  CURRENT FESTIVAL THEME
// ==========================
const currentFestival = {
  name: 'Diwali',
  emoji: '🪔',
  colors: { gradient: 'linear-gradient(45deg, #ff512f, #dd2476)' },
};

// ==========================
//  ROUTES
// ==========================

// --------------------------
//  HOME PAGE
// --------------------------
app.get('/', (req, res) => {
  res.render('index', { products, currentFestival });
});

// --------------------------
//  PRODUCTS LISTING PAGE
// --------------------------
app.get('/products', (req, res) => {
  res.render('products', {
    products,
    currentFestival
  });
});

// --------------------------
//  SINGLE PRODUCT PAGE
// --------------------------
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.render('product_details', {
    product,
    currentFestival
  });
});

// --------------------------
//  ADMIN PAGE
// --------------------------
app.get('/admin', (req, res) => {
  res.render('admin', { currentFestival });
});

// --------------------------
//  PROFILE PAGE
// --------------------------
app.get('/profile', (req, res) => {
  res.render('profile', { currentFestival });
});

// ==========================
//  CART SYSTEM
// ==========================

// CART PAGE
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartTotal > 999 ? 0 : 99;
  const discount = Math.round(cartTotal * 0.1);
  const finalTotal = cartTotal + deliveryFee - discount;

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

// ADD TO CART
app.post('/cart/add/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) return res.redirect('/');

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ ...product, quantity: 1 });
  }

  res.redirect('/cart');
});

// REMOVE FROM CART
app.post('/cart/remove/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  req.session.cart = req.session.cart.filter(item => item.id !== productId);
  res.redirect('/cart');
});

// UPDATE QUANTITY
app.post('/cart/update/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const action = req.query.action;
  const item = req.session.cart.find(item => item.id === productId);

  if (item) {
    if (action === 'increase') item.quantity += 1;
    if (action === 'decrease' && item.quantity > 1) item.quantity -= 1;
  }

  res.redirect('/cart');
});

// ==========================
//  CHECKOUT PAGE
// ==========================
app.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.redirect('/cart');
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartTotal > 999 ? 0 : 99;
  const discount = Math.round(cartTotal * 0.1);
  const finalTotal = cartTotal + deliveryFee - discount;

  res.render('checkout', {
    cart,
    cartTotal,
    deliveryFee,
    discount,
    finalTotal,
    currentFestival,
  });
});

// PLACE ORDER
app.post('/checkout/place-order', (req, res) => {
  req.session.cart = [];
  res.render('order-success', { currentFestival });
});

// ==========================
//  SERVER START
// ==========================
app.listen(PORT, () => {
  console.log(`🎉 Festify server running on http://localhost:${PORT}`);
});
