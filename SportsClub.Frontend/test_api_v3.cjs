const axios = require('axios');

async function createSuperAdmin() {
    try {
        console.log("Registering superadmin...");
        const regRes = await axios.post('http://localhost:5062/api/Auth/register', {
            firstName: "Sistem",
            lastName: "Kurucusu",
            email: "superadmin@sportsclub.com",
            password: "Password123!",
            role: "Admin"
        });
        console.log("Register Res:", regRes.data);

        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:5062/api/Auth/login', {
            email: "superadmin@sportsclub.com",
            password: "Password123!"
        });
        const token = loginRes.data.token;
        console.log("Token received.");

        const athleteData = {
            firstName: "Test",
            lastName: "Sporcu",
            motherName: "Anne",
            fatherName: "Baba",
            schoolName: "Test Okulu",
            grade: "9",
            dateOfBirth: "2010-05-10T00:00:00.000Z",
            placeOfBirth: "Istanbul",
            address: "Test Adres",
            phoneNumber: "05554443322",
            bloodType: 1,
            regularMedications: "",
            chronicDiseases: "",
            height: 180,
            weight: 75,
            shoeSize: 42,
            emergencyContactName: "Acil",
            emergencyContactPhone: "05321112233",
            emergencyContactRelation: "Dayi"
        };

        console.log("Creating athlete...");
        const createRes = await axios.post('http://localhost:5062/api/Athletes', athleteData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Success Athlete ID:", createRes.data.id);
    } catch (error) {
        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}
createSuperAdmin();
