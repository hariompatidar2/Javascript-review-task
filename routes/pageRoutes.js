const express= require('express');
const { createPage, updatePage, getPageByIdOrSlug, getAllPages, deletePage} = require('../controllers/pageController');
const { isAuthenticatedUser } = require('../middleware/auth');
const router= express.Router();

router.route("/page").post(isAuthenticatedUser,createPage);
router.route("/page/:id")
.put(isAuthenticatedUser,updatePage)
.delete(isAuthenticatedUser,deletePage)

router.route("/page/:id").get(getPageByIdOrSlug)
router.route("/pages").get(getAllPages)

module.exports= router;