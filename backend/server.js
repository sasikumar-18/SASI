const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileshop';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('MobileGear Backend API is running...');
});

// MongoDB Schemas
const productSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    discount: Number,
    description: String,
    imageUrl: String,
    images: [String],
    category: String,
    stock: Number,
    rating: Number,
    reviewsCount: Number,
    seller: String,
    deliveryBy: String,
    specs: mongoose.Schema.Types.Mixed,
    features: [String]
});

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: String
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        name: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        phone: String
    },
    paymentMethod: { type: String, default: 'COD' },
    paymentStatus: { type: String, default: 'Pending' },
    orderStatus: { type: String, default: 'Ordered' },
    couponCode: String,
    createdAt: { type: Date, default: Date.now }
});

// --- Authentication System --- (MUST be defined before routes that use User)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    usedCoupons: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single product by id field (e.g., m1, a1)
app.get('/api/products/:id', async (req, res) => {
    try {
        console.log('Fetching product with id:', req.params.id);
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            console.log('Product not found in DB, checking by _id...');
            // Fallback to _id if not found by id field
            const productByObjectId = await Product.findById(req.params.id).catch(() => null);
            if (!productByObjectId) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(productByObjectId);
        }
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);

        // Payment Simulation Logic
        if (newOrder.paymentMethod !== 'COD') {
            // Simulate external payment gateway success
            newOrder.paymentStatus = 'Paid';
        }

        const savedOrder = await newOrder.save();

        // Update User's used coupons if applicable
        if (req.body.couponCode) {
            await User.findByIdAndUpdate(req.body.userId, {
                $addToSet: { usedCoupons: req.body.couponCode.toUpperCase() }
            });
        }

        res.status(201).json({
            message: 'Order protocol initialized successfully',
            orderId: savedOrder._id,
            status: savedOrder.paymentStatus
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get orders by userId
app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// User schema & model already defined above (before routes)

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
    console.log(`[${new Date().toISOString()}] Registration attempt for:`, req.body.email);
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        console.log('User registered successfully:', email);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                uid: newUser._id,
                email: newUser.email,
                displayName: newUser.name,
                usedCoupons: newUser.usedCoupons
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: {
                uid: user._id,
                email: user.email,
                displayName: user.name,
                role: user.role,
                usedCoupons: user.usedCoupons || []
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 MobileGear Nexus running on port ${PORT}`);
});
