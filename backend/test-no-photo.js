const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function run() {
  try {
    const form = new FormData();
    form.append('session', '2023-2024');
    form.append('regNo', `TEST-NOPHOTO-${Date.now()}`); 
    form.append('nameEn', 'No Photo User');
    form.append('nameBn', 'বিজ্ঞপ্তি ইউজার');
    const mobile = `018${Math.floor(Math.random() * 100000000)}`;
    form.append('mobile', mobile);
    form.append('email', `testnophoto.${Date.now()}@example.com`);
    form.append('addressEn', 'Dhaka');
    form.append('addressBn', 'ঢাকা');
    form.append('upazila', 'Sadar');
    form.append('department', 'CSE');
    form.append('bloodGroup', 'O+');
    form.append('hall', 'FHH');
    form.append('gender', 'Male');
    form.append('isEmployed', 'false');
    form.append('password', 'password123');

    // Skipping photo append entirely

    await axios.post('http://localhost:5001/api/students', form, {
      headers: form.getHeaders()
    });
    console.log("Registration Successful (No Photo)!");
  } catch (err) {
    console.error("Test Failed!", err.response ? err.response.data : err.message);
  }
}
run();
