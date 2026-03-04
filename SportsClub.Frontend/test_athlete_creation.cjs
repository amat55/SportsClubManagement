const axios = require('axios');
(async () => {
    try {
        const login = await axios.post('http://localhost:5062/api/Auth/login', { email: "superadmin@sportsclub.com", password: "Password123!" });
        const data = {
            firstName: "Ali", lastName: "Yilmaz", motherName: "Ayse", fatherName: "Ahmet",
            dateOfBirth: "2010-01-01", placeOfBirth: "Istanbul", phoneNumber: "05555555555",
            address: "Kadikoy", bloodType: 1, schoolName: "High School", grade: "10",
            regularMedications: "", chronicDiseases: "", height: 180, weight: 75, shoeSize: 42,
            emergencyContactName: "Ayse", emergencyContactPhone: "05554443322", emergencyContactRelation: "Anne"
        };
        const res = await axios.post('http://localhost:5062/api/Athletes', data, {headers: {Authorization: `Bearer ${login.data.token}`}});
        console.log("Success:", res.data);
    } catch(err) {
        console.error("ERROR:");
        console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
    }
})();
