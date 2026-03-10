const axios = require('axios');

async function run() {
  try {
    // 1. Admin Login
    console.log("1. Testing Admin Login...");
    const loginRes = await axios.post('http://localhost:5001/api/admin/login', {
      username: 'admin',
      password: 'adminpassword123'
    });
    const adminToken = loginRes.data.token;
    console.log(`   ✅ Logged in as: ${loginRes.data.username} (${loginRes.data.role})`);

    // 2. Fetch pending students
    console.log("\n2. Fetching all students from Admin API...");
    const stuRes = await axios.get('http://localhost:5001/api/admin/students', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`   ✅ Found ${stuRes.data.length} student(s)`);

    if (stuRes.data.length === 0) {
      console.log("   ⚠️  No students found. Register a student first!");
      return;
    }

    const firstPending = stuRes.data.find(s => s.status === 'Pending');
    if (!firstPending) {
      console.log("   ⚠️  No pending students to approve. All already processed.");
      return;
    }

    // 3. Approve first pending student
    console.log(`\n3. Approving student: ${firstPending.nameEn} (${firstPending._id})`);
    const approveRes = await axios.put(
      `http://localhost:5001/api/admin/students/${firstPending._id}/status`,
      { status: 'Approved' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log(`   ✅ Student status is now: ${approveRes.data.status}`);
    console.log(`   ✅ Activities logged: ${approveRes.data.activities.length} entry(ies)`);
    const lastActivity = approveRes.data.activities[approveRes.data.activities.length - 1];
    console.log(`   ✅ Activity: "${lastActivity.actionTitle}" by "${lastActivity.adminName}" at ${new Date(lastActivity.timestamp).toLocaleString()}`);

    console.log("\n✅ All Admin API tests passed successfully!");

  } catch(err) {
    console.error("❌ Test failed:", err.response ? JSON.stringify(err.response.data) : err.message);
  }
}
run();
