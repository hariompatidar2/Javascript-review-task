const app= require('./app');
const { cloudinaryConnect } = require('./config/cloudinary');
const { dbconnect } = require('./config/database');
const dailyMailScheduler = require('./controllers/sendDailyMails');
require("dotenv").config();
const PORT= process.env.PORT || 4000;

// connect database
dbconnect()

cloudinaryConnect()

dailyMailScheduler();

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})