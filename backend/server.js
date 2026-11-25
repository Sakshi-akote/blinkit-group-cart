const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'] }));
app.use(express.json());

// Pre-defined Store Catalog (Fixed prices & real data)
const storeProducts = [
  { id: 101, name: 'Coca-Cola Aerated Drink (1.25 L)', price: 95, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100' },
  { id: 102, name: "Lay's American Style Cream & Onion", price: 50, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100' },
  { id: 103, name: 'Amul Pasteurized Butter (500g)', price: 275, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100' },
  { id: 104, name: 'Kurkure Solid Masti Twist', price: 20, image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=100' },
  { id: 105, name: 'Red Bull Energy Drink (250ml)', price: 125, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=100' }
];

let cartData = {
  handlingCharge: 5,
  deliveryCharge: 0,
  items: [
    { id: 101, name: 'Coca-Cola Aerated Drink (1.25 L)', price: 95, qty: 2, addedBy: 'You', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100' },
    { id: 102, name: "Lay's American Style Cream & Onion", price: 50, qty: 1, addedBy: 'Amit', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100' }
  ]
};

app.get('/', (req, res) => {
  res.send('Blinkit Backend API is running!');
});

// Get Cart & Store Catalog
app.get('/api/cart', (req, res) => {
  res.json({ cart: cartData, catalog: storeProducts });
});

// Update Quantity
app.post('/api/cart/update-qty', (req, res) => {
  const { itemId, change } = req.body;
  const item = cartData.items.find(i => i.id === itemId);

  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cartData.items = cartData.items.filter(i => i.id !== itemId);
    }
  }
  res.json({ success: true, cart: cartData });
});

// Add Item from Catalog
app.post('/api/cart/add-from-catalog', (req, res) => {
  const { productId, addedBy } = req.body;
  const product = storeProducts.find(p => p.id === productId);

  if (product) {
    const existing = cartData.items.find(i => i.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cartData.items.push({ ...product, qty: 1, addedBy });
    }
  }
  res.json({ success: true, cart: cartData });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT} - server.js:67`);
});