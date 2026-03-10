const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function run() {
  try {
    console.log("1. Testing Registration...");
    const form = new FormData();
    form.append('session', '2023-2024');
    form.append('regNo', `TEST-${Date.now()}`); // unique
    form.append('nameEn', 'Test User');
    form.append('nameBn', 'টেস্ট ইউজার');
    const mobile = `017${Math.floor(Math.random() * 100000000)}`;
    form.append('mobile', mobile);
    form.append('email', `test.${Date.now()}@example.com`);
    form.append('addressEn', 'Dhaka');
    form.append('addressBn', 'ঢাকা');
    form.append('upazila', 'Brahmanbaria Sadar');
    form.append('department', 'CSE');
    form.append('bloodGroup', 'O+');
    form.append('hall', 'FHH');
    form.append('gender', 'Male');
    form.append('isEmployed', 'false');
    form.append('password', 'password123');

    // Empty file buffer for photo
    form.append('photo', Buffer.from('fake image data'), { filename: 'test.png', contentType: 'image/png' });

    await axios.post('http://localhost:5001/api/students', form, {
      headers: form.getHeaders()
    });
    console.log("Registration Successful!");

    console.log("\n2. Testing Login...");
    const loginRes = await axios.post('http://localhost:5001/api/students/login', {
      emailOrMobile: mobile,
      password: 'password123'
    });
    console.log("Login Successful! Token received:", loginRes.data.token.substring(0, 15) + '...');

    console.log("\n3. Testing Profile fetching...");
    const profileRes = await axios.get('http://localhost:5001/api/students/me', {
      headers: { Authorization: `Bearer ${loginRes.data.token}` }
    });
    console.log("Profile Data fetched:", profileRes.data.nameEn);

  } catch (err) {
    if (err.response) {
      console.error("Test Failed! Status:", err.response.status, "Data:", err.response.data);
    } else {
      console.error("Test Failed!", err.message);
    }
  }
}
run();
