const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/titas_clone');
        console.log('Connected to MongoDB');

        const Post = mongoose.model('BlogPost', new mongoose.Schema({ title: String, featuredImage: String, slug: String }));
        const Student = mongoose.model('Student', new mongoose.Schema({ nameEn: String, photo: String }));

        const posts = await Post.find({}).limit(3);
        console.log('Posts:', JSON.stringify(posts, null, 2));

        const students = await Student.find({ photo: { $exists: true, $ne: '' } }).limit(3);
        console.log('Students:', JSON.stringify(students, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkData();
