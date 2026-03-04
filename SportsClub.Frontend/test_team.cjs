const axios = require('axios');

async function testTeam() {
    try {
        const loginRes = await axios.post('http://localhost:5062/api/Auth/login', {
            email: "superadmin@sportsclub.com",
            password: "Password123!"
        });
        const token = loginRes.data.token;

        const teamData = {
            name: "Test Takim",
            branchId: "b7e45e4e-862d-4d76-8051-fa7b4b7c1abf", // Random guid
            season: "2024-2025",
            coachId: "b7e45e4e-862d-4d76-8051-fa7b4b7c1abf" // Random guid
        };

        const createRes = await axios.post('http://localhost:5062/api/Teams', teamData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Success:", createRes.data);
    } catch (error) {
        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}
testTeam();
