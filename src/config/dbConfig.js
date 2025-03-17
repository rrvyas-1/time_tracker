const mongoose = require("mongoose");

const dbConfig = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Db connected Successfully`);
    } catch (e) {
        console.log(`Error occured while connecting database : ${e.message}`);
    }
};

dbConfig(); 