const axios = require('axios');
const jwtDecode = require('jwt-decode');

async function checkUser(email) {
    try {
        const loginRes = await axios.post('http://localhost:5062/api/Auth/login', {
            email: email,
            password: "Password123!"
        });
        const token = loginRes.data.token;
        const decoded = jwtDecode.jwtDecode(token);
        console.log(`--- ${email} ---`);
        console.log("Roles inside JWT:", decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || "NO ROLES");
    } catch (error) {
        console.error(`Login failed for ${email}:`, error.message);
    }
}
async function run() {
    await checkUser("admin@sportsclub.com");
    await checkUser("superadmin@sportsclub.com");
}
run();
