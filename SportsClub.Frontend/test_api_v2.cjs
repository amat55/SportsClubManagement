const axios = require('axios');

async function testAthlete() {
    try {
        const loginRes = await axios.post('http://localhost:5062/api/Auth/login', {
            email: "admin@sportsclub.com",
            password: "Password123!"
        });
        const token = loginRes.data.token;

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

        const createRes = await axios.post('http://localhost:5062/api/Athletes', athleteData, {
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
testAthlete();
