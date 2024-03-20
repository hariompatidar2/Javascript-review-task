const Page = require("../models/Page");
const catchAsyncErrors= require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const {uploadPdfToCloudinary,destroyImageFromCloudinary} = require('../utils/ImageUploader')
const slugify= require("slugify");
const mongoose = require("mongoose");


exports.createPage = catchAsyncErrors(async (req, res, next) => {
    const { title, description, content, slug, showAuthor } = req.body;

    if (!title || !description || !content || !slug) {
        return next(new ErrorHandler("Please enter all the details", 400));
    }

    const page = await Page.findOne({ slug,isDeleted: false });
    if (page) {
        return next(new ErrorHandler("Page already exists with this URL", 400));
    }
    const attachments = [];

    const files = Object.values(req.files || {});

    await Promise.all(files.map(async file => {
        const result = await uploadPdfToCloudinary(file, process.env.CLOUDINARY_DOCUMENT_FOLDER_NAME);
        attachments.push({
            url: result.secure_url,
            filename: result.original_filename,
            size: result.bytes
        });
    }));

    const titleSlug = slugify(title, { lower: true });

    const newPage = await Page.create({
        title,
        titleSlug,
        slug,
        description,
        content,
        attachments,
        status: "Draft",
        showAuthor,
        createdBy: req.user.id,
        updatedBy: req.user.id,
    });

    return res.status(201).json({
        success: true,
        message: "Page created successfully",
        data: newPage
    });
});


exports.updatePage = catchAsyncErrors(async (req, res, next) => {
    const { title, description, content, showAuthor, slug } = req.body;
    const { id } = req.params;

    if (!title || !description || !content || !slug) {
        return next(new ErrorHandler("Please provide all required fields",401));
    }

    const page = await Page.findById(id);

    if (!page) {
        return next(new ErrorHandler("Page not found",404));
    }

    if(page.slug !== slug){
        const alreadySlug = await Page.findOne({slug, isDeleted:false});
        if(alreadySlug){
            return next(new ErrorHandler("Page already exists with this URL",400));
        }
    }

    page.title = title;
    page.description = description;
    page.content = content;
    page.showAuthor = showAuthor;
    page.slug = slug;
    page.updatedBy = req.user.id;

    const incomingAttachmentsIds = [];
    let attachmentIndex = 0;
    while (req.body[`attachment_${attachmentIndex}`]) {
        incomingAttachmentsIds.push(req.body[`attachment_${attachmentIndex}`]._id);
        attachmentIndex++;
    }

    for (const existingAttachment of page.attachments) {
        const isIncoming = incomingAttachmentsIds.includes(existingAttachment._id.toString());

        if (!isIncoming) {
            await destroyImageFromCloudinary(existingAttachment.filename);
            page.attachments.pull(existingAttachment);
        }
    }  


    const files = Object.values(req.files || {});

    await Promise.all(files.map(async file => {
        const result = await uploadPdfToCloudinary(file, process.env.CLOUDINARY_DOCUMENT_FOLDER_NAME);
        page.attachments.push({
            url: result.secure_url,
            filename: result.original_filename,
            size: result.bytes
        });
    }));

    // Save updated page
    const updatedPage = await page.save();

    res.status(200).json({
        success: true,
        message: "Page updated successfully.",
        data: updatedPage
    });
});


exports.deletePage= catchAsyncErrors(async (req,res,next)=>{
    const { id } = req.params;
    console.log(id);

    const page = await Page.findById(id);

    if (!page) {
        return next(new ErrorHandler("Page not found",404));
    }

    page.isDeleted = true;
    // page.slug= null;
    page.updatedBy = req.user.id;

    await page.save();

    res.status(200).json({
        success: true,
        message: "Page deleted successfully."
    });
})

exports.getPageByIdOrSlug= catchAsyncErrors(async (req,res,next)=>{
    const { id } = req.params;

    let page;
    if (mongoose.Types.ObjectId.isValid(id)) {
        page = await Page.findById(id).populate("createdBy");
    } else {
        page = await Page.findOne({ slug: id, isDeleted: false }).populate("createdBy");
    }

    if (!page) {
        return next(new ErrorHandler("Page not found", 404));
    }

    res.status(200).json({
        success: true,
        data: page
    });
})

exports.getAllPages = catchAsyncErrors(async (req, res, next) => {
    const { search, status, createdBy } = req.query;

    let query = {isDeleted: false};

    if (search) {
      query.titleSlug = { $regex: search, $options: "i" };
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (createdBy && createdBy !== "all") {
      query["createdBy"] = createdBy;
    }
    const pages = await Page.find(query).populate("createdBy updatedBy");
    res.status(200).json({
        success: true,
        data: pages
    });
});



