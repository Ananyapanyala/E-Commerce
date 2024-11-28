const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Import User model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/authDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Add a User
async function addUser(email, plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = new User({ email, password: hashedPassword });

    try {
        const result = await user.save();
        console.log('User added:', result);
    } catch (err) {
        console.error('Error adding user:', err);
    }
}

// Example usage
addUser('admin@example.com', 'adminpassword'); // Replace with your data
