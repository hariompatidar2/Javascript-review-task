const express= require('express');
const router= express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');
const { schedulePublish, updateScheduledPublish, cancelScheduledPublish } = require('../controllers/schedulePublishController');


router.route('/publication/:id').post(isAuthenticatedUser,schedulePublish)
.put(isAuthenticatedUser,updateScheduledPublish)
.delete(isAuthenticatedUser,cancelScheduledPublish)


module.exports= router;