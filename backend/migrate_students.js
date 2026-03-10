const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Student = require('./models/Student');

const MONGO_URI = 'mongodb://127.0.0.1:27017/titas_clone';
const BASE_API_URL = 'https://titasdu.com/api/students';
const BASE_IMAGE_URL = 'https://data.titasdu.com';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const filePath = path.join(UPLOADS_DIR, filename);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download image: ${url}`);
        return null;
    }
}

async function migrateData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Drop unique indexes that conflict with duplicate data from the original site
        const indexesToDrop = ['email_1', 'regNo_1'];
        for (const idx of indexesToDrop) {
            try {
                await mongoose.connection.collection('students').dropIndex(idx);
                console.log(`Dropped index: ${idx}`);
            } catch (e) {
                console.log(`Index ${idx} not found or already dropped, continuing...`);
            }
        }

        // Clear previously imported students (those with an originalId field)
        const deleted = await mongoose.connection.collection('students').deleteMany({ originalId: { $exists: true } });
        console.log(`Cleared ${deleted.deletedCount} previously imported records.`);

        let currentPage = 1;
        let totalPages = 1;
        let totalImported = 0;
        let skipped = 0;

        while (currentPage <= totalPages) {
            console.log(`Fetching page ${currentPage} of ${totalPages}...`);
            const response = await axios.get(`${BASE_API_URL}?page=${currentPage}&limit=50`);
            const data = response.data;

            if (currentPage === 1) {
                totalPages = data.pagination.totalPages;
                console.log(`Found total ${data.pagination.total} students across ${totalPages} pages.`);
            }

            const students = data.students || data.data || data;

            for (const item of students) {
                try {
                    // Determine image path and download
                    let localPhotoPath = null;
                    if (item.image_path) {
                        const filename = path.basename(item.image_path);
                        const filePath = path.join(UPLOADS_DIR, filename);
                        // Skip download if file already exists
                        if (!fs.existsSync(filePath)) {
                            await downloadImage(`${BASE_IMAGE_URL}${item.image_path}`, filename);
                        }
                        localPhotoPath = `/uploads/${filename}`;
                    }

                    const newStudent = {
                        originalId: item.id, // Keep the original site's ID for tracking
                        session: item.student_session || 'Unknown',
                        regNo: item.du_reg_number,
                        nameEn: item.name_en || 'Unknown',
                        nameBn: item.name_bn || 'Unknown',
                        mobile: item.mobile || 'Unknown',
                        email: item.email || `${item.id}@placeholder.com`,
                        addressEn: item.address_en || 'Unknown',
                        addressBn: item.address_bn || 'Unknown',
                        upazila: item.upazila || 'Unknown',
                        department: item.department || 'Unknown',
                        bloodGroup: item.blood_group || 'Unknown',
                        hall: item.hall || 'Unknown',
                        gender: item.gender || 'Unknown',
                        isEmployed: !!item.job_position,
                        organization: item.job_designation || '',
                        jobTitle: item.job_position || '',
                        photo: localPhotoPath,
                        password: item.password,
                        status: item.approval === 1 ? 'Approved' : item.approval === 2 ? 'Rejected' : 'Pending',
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    };

                    // Match on original site ID to avoid duplicates
                    await mongoose.connection.collection('students').updateOne(
                        { originalId: item.id },
                        { $set: newStudent },
                        { upsert: true }
                    );
                    totalImported++;
                } catch (studentErr) {
                    skipped++;
                    console.warn(`Skipped ${item.name_en} (id:${item.id}): ${studentErr.message}`);
                }
            }
            console.log(`Imported page ${currentPage}... Total so far: ${totalImported}, Skipped: ${skipped}`);
            currentPage++;
        }

        const finalCount = await mongoose.connection.collection('students').countDocuments();
        console.log(`\nMigration Complete! Imported: ${totalImported}, Skipped: ${skipped}, Total in DB: ${finalCount}`);
        mongoose.disconnect();
    } catch (err) {
        console.error('Migration failed:', err.message);
        mongoose.disconnect();
    }
}

migrateData();

