const express = require('express');
const User = require('./models/User');

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

// Dashboard route - get user details
router.get('/dashboard', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.userId).select('-password');
    res.json({
        username: user.username,
        email: user.email,
        orders: user.orders,
        addresses: user.addresses,
        paymentMethods: user.paymentMethods,
        paypal: user.paypal,
        amazonPayBalance: user.amazonPayBalance,
    });
});

// Update address route
router.post('/update-addresses', isAuthenticated, async (req, res) => {
    const { address } = req.body;
    const user = await User.findById(req.session.userId);

    user.addresses.push(address);
    await user.save();

    res.json({ message: 'Address updated successfully', addresses: user.addresses });
});

// Update payment method route
router.post('/update-payment', isAuthenticated, async (req, res) => {
    const { paymentMethod } = req.body;
    const user = await User.findById(req.session.userId);

    user.paymentMethods.push(paymentMethod);
    await user.save();

    res.json({ message: 'Payment method updated successfully', paymentMethods: user.paymentMethods });
});

module.exports = router;
