const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/titas_clone')
    .then(async () => {
        console.log('MongoDB Connected for Seeder');

        // Check if admin exists
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const admin = new Admin({
            username: 'admin',
            password: 'adminpassword123',
            role: 'Super Admin'
        });

        await admin.save();
        console.log('Admin user seeded successfully. Username: admin, Password: adminpassword123');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
