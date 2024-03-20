const express= require('express');
const app= express();
const cors= require('cors');
const morgan= require('morgan');
const cookieParser= require('cookie-parser');
const errorMiddleware= require('./utils/error');
const userRoutes= require('./routes/userRoutes');
const postRoutes= require('./routes/pageRoutes');
const schedulePublish= require('./routes/schedulePublicationRoutes');
const fileUpload = require('express-fileupload');


app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.use("/api/v1",userRoutes);
app.use("/api/v1",postRoutes);
app.use("/api/v1",schedulePublish);


app.use(errorMiddleware);


module.exports = app;