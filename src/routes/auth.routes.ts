const express = require("express")
const router = express.Router()


import { checkUser, LoginUser, registerUser } from "../controllers/auth.controller"


router.post("/register", registerUser)
router.post("/check-user", checkUser)
router.post("/login", LoginUser)


export default router;