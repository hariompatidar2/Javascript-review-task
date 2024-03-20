const cron = require("node-cron");
const User = require("../models/User");
const SchedulePublication = require("../models/SchedulePublication");
const sendEmail = require("../utils/sendEmail");

const dailyMailScheduler = async () => {
  cron.schedule(
    "0 8 * * *",
    async () => {
      const today = new Date();
      const isoString =
        today.toISOString().slice(0, 10) + "T00:00:00.000+00:00";

      const users = await User.find({
        isActive: true,
        isDeleted: false,
        subscribedDailyDigest: true,
      });
      for (const user of users) {
        const publications = await SchedulePublication.find({
          publishDateTime: isoString,
          status: "Scheduled",
          createdBy: user._id,
        }).populate("page");

        console.log("All publications", publications);

        if (publications.length > 0) {
          let emailContent = "Publications scheduled for today:<br><ul>";
          for (const publication of publications) {
            emailContent += `<li>${
              publication.page.title
            } - ${publication.publishDateTime}</li>`;
          }
          emailContent += "</ul>";

          await sendEmail({
            email:user.email,
            subject:"Todays publication",
            message:emailContent
          });
        }
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = dailyMailScheduler;
