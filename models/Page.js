const mongoose= require('mongoose');

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
});

const pageSchema= new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter the title"],
        trim: true,
    },
    titleSlug:{
        type: String,
        required: [true, "Please enter the titleSlug"],
        trim: true,
        index: true
    },
    slug:{
        type: String,
        required: [true, "Please enter the slug"],
        // unique: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: [true, "Please enter the description"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Please enter the content"],
        trim: true,
    },
    attachments:[attachmentSchema],
    status:{
        type:String,
        enum:["Draft","Scheduled","Published"],
        default:"Draft",
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please enter the createdBy"],
    },
    showAuthor:{
        type: Boolean,
        default: false,
    },
    publishDate:{
        type: Date,
    },
    publishTime: {
        type: String,
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please enter the updatedBy"],
    },
    isDeleted:{
        type: Boolean,
        default: false,
    }
    
},{timestamps: true})

module.exports= mongoose.model("Page",pageSchema);