const Page = require("../models/Page");
const ErrorHandler = require("../utils/errorHandler");
const cron = require("node-cron");
const SchedulePublication = require("../models/SchedulePublication");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const moment = require("moment");
const sendEmail = require("../utils/sendEmail");

const parseDateTime = (dateString, timeString) => {
  const dateTimeString = `${dateString}T${timeString}`;
  return moment(dateTimeString, "YYYY-MM-DDTHH:mm").toDate();
};

const dateToCronString = (date) => {
  return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;
};

exports.schedulePublish = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { publishDate, publishTime } = req.body;

  if (!id || !publishDate || !publishTime) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let page = await Page.findById(id).populate("createdBy");
  if (!page || page.status === "Scheduled" || page.status === "Published") {
    return next(new ErrorHandler("Something went wrong", 404));
  }

  const publishDateTime = parseDateTime(publishDate, publishTime);

  const scheduledPublication = await SchedulePublication.create({
    page: id,
    publishDateTime:new Date(publishDate),
    status: "Scheduled",
    createdBy: req.user.id,
  });

  page.status = "Scheduled";
  page.publishDate = publishDate;
  page.publishTime = publishTime;
  page = await page.save();

  const jobName = scheduledPublication._id.toString();
  const job = cron.schedule(
    dateToCronString(publishDateTime),
    async () => {
      page.status = "Published";
      await page.save();
      scheduledPublication.status = "Published";
      await scheduledPublication.save();
      console.log(`Page ${page._id} published at ${publishDateTime}`);
      await sendEmail({
        email: page.createdBy.email,
        subject: "Page published",
        message: `Your page ${page.title} has been published at ${publishDate} ${publishTime}.`,
      });
    },
    {
      scheduled: true,
      name: jobName,
    }
  );

  res.status(201).json({
    success: true,
    message: "Page scheduled for publication",
  });
});

exports.updateScheduledPublish = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { publishDate, publishTime } = req.body;

  if (!publishDate || !publishTime) {
    return next(new ErrorHandler("Please provide all the fields", 400));
  }

  const page = await Page.findById(id);
  if (!page) {
    return next(new ErrorHandler("Page not found", 404));
  }

  const scheduledPublication = await SchedulePublication.findOne({ page: id });
  if (!scheduledPublication || scheduledPublication.status === "Published") {
    return next(
      new ErrorHandler("Something went wrong or page is already published", 404)
    );
  }

  const publishDateTime = parseDateTime(publishDate, publishTime);

  scheduledPublication.publishDateTime = publishDateTime;
  await scheduledPublication.save();

  page.publishDate = publishDate;
  page.publishTime = publishTime;
  await page.save();

  const jobName = scheduledPublication._id.toString();

  const tasks = cron.getTasks();

  for (let [key, value] of tasks) {
    if (value.name === jobName) {
      cron.destroy(value.name);
      const newJob = cron.schedule(
        dateToCronString(publishDateTime),
        async () => {
          page.status = "Published";
          await page.save();
          scheduledPublication.status = "Published";
          await scheduledPublication.save();
          console.log(`Page ${page._id} published at ${publishDateTime}`);
        },
        {
          scheduled: true,
          name: jobName,
        }
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Page publication time updated",
  });
});


exports.cancelScheduledPublish = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const page = await Page.findById(id);
  if (!page || page.status === "Published") {
    return next(
      new ErrorHandler("Something went wrong or page is already published", 400)
    );
  }

  const scheduledPublication = await SchedulePublication.findOne({ page: id });
  if (!scheduledPublication) {
    return next(new ErrorHandler("Scheduled page not found", 404));
  }

  scheduledPublication.status = "Canceled";
  await scheduledPublication.save();

  const jobName = scheduledPublication._id.toString();
  const tasks = cron.getTasks();
  for (const [key, value] of tasks) {
    if (value.name === jobName) {
      cron.destroy(value.name);
    }
  }

  page.status = "Draft";
  page.publishDate = null;
  page.publishTime = null;
  await page.save();

  res.status(200).json({
    success: true,
    message: "Scheduled publication canceled",
    data: page,
  });
});
