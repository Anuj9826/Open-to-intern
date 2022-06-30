const internModel = require("../models/internModel")
const mongoose = require('mongoose')
const collegeModel = require("../models/collegeModel")

// --------------------------- Regex for email and mobile ---------------------

const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
const mobileRegex = /^[6-9]\d{9}$/
// const nameRegex = /^[a-zA-Z]{1,20}$/
const nameRegex = /^[ a-z ]+$/i


// ---------------------------- Validation -------------------------------------

const objectValue = function (value) {
    if (typeof value === undefined || value === null) return false    //|| typeof value === Number
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number) return false
    return true
}

// -------------------------- CREATE Intern -----------------------------

const createIntern = async function (req, res) {
    try {
        if (Object.keys(req.query).length == 0) {
            const internData = req.body
            internData.name = internData.name.trim()
            const { name, email, mobile, collegeName } = internData
            //console.log(internData)

            if (Object.keys(internData).length == 0) {
                return res.status(400).send({ status: false, msg: "Please Provide Data" })
            }

            if (!internData.name) {
                return res.status(400).send({ status: false, msg: "Please Provide Name" })
            }

            // if (!objectValue(internData.name)) {
            //     return res.status(400).send({ status: false, msg: "Please Provide valid Name" })
            // }
            if (!internData.name.match(nameRegex)) {
                return res.status(400).send({ status: false, msg: "Please Provide correct input for name" })
            }
            if (!internData.email) {
                console.log(internData.email)
                return res.status(400).send({ status: false, msg: "Please Provide email" })
            }
            if (!emailRegex.test(internData.email))
                return res.status(400).send({ status: false, message: "Please Enter Email in valid Format" })

            let duplicateEmail = await internModel.findOne({ email: internData.email });
            if (duplicateEmail) {
                return res.status(400).send({ status: false, msg: "Email already exists!" });
            }
            if (!internData.mobile) {
                return res.status(400).send({ status: false, msg: "Please Provide Mobile No" })
            }
            if (!mobileRegex.test(internData.mobile)) {
                return res.status(400).send({ status: false, msg: "Please Provide valid Mobile No" })
            }
            let duplicateMobile = await internModel.findOne({ mobile: internData.mobile });
            if (duplicateMobile) {
                return res.status(400).send({ status: false, msg: "Mobile No. already exists!" });
            }
            if (!internData.collegeName) {
                return res.status(400).send({ status: false, msg: "Please Provide college name" })

            }
            const collegeData = await collegeModel.findOne({ name: collegeName })
            if (!collegeData) {
                return res.status(400).send({ status: false, msg: "Invalid College Name" })
            }
            const collegeId = collegeData._id
            const dataOfIntern = { name, email, mobile, collegeId } // restructuring of internData
            let savedData = await internModel.create(dataOfIntern)
            return res.status(201).send({
                status: true,
                data: {
                    isDeleted: savedData.isDeleted,
                    name: savedData.name,
                    email: savedData.email,
                    mobile: savedData.mobile,
                    collegeId: savedData.collegeId
                }
            })
        } else {
            return res.status(400).send({ status: false, msg: "Invalid Request, You cannot provide data in query Params" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports.createIntern = createIntern