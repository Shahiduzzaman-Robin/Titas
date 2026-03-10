const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const username = String(process.argv[2] || '').trim();
const password = String(process.argv[3] || '').trim();

if (!username || !password) {
    console.log('Usage: node createContentAdmin.js <username> <password>');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/titas_clone')
    .then(async () => {
        const exists = await Admin.findOne({ username });
        if (exists) {
            console.log(`Admin username already exists: ${username}`);
            process.exit(1);
        }

        const contentAdmin = new Admin({
            username,
            password,
            role: 'Content Admin',
        });

        await contentAdmin.save();
        console.log(`Content Admin created: ${username}`);
        process.exit(0);
    })
    .catch((err) => {
        console.error('Failed to create Content Admin:', err.message || err);
        process.exit(1);
    });