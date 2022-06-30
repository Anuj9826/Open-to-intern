const express = require('express');
const router = express.Router();
const collegeController = require("../controller/collegeController");
const internController = require("../controller/internController");


//---------------------- CREATE College and Interns ------------------------------------------
router.post("/functionup/colleges", collegeController.createCollege)
router.post("/functionup/interns", internController.createIntern)

//---------------------- Get College Details ---------------------------------------------------

router.get("/functionup/collegeDetails", collegeController.getCollegeDetails)


module.exports = router;