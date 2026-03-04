const axios = require('axios');

async function seed() {
    try {
        console.log("Logging in as superadmin...");
        const loginRes = await axios.post('http://localhost:5062/api/Auth/login', {
            email: "superadmin@sportsclub.com",
            password: "Password123!"
        });
        const token = loginRes.data.token;
        console.log("Token received.");

        const branches = ['Basketbol', 'Voleybol', 'Yüzme', 'Cimnastik', 'Masa Tenisi'];

        for (const branch of branches) {
            console.log(`Creating branch: ${branch}...`);
            await axios.post('http://localhost:5062/api/Teams/branches', { name: branch }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }

        console.log("All essential branches seeded successfully!");
    } catch (error) {
        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}
seed();
