const express = require("express")
const router = express.Router()
import { buySubscriptionPlan, cancelSubcription } from "../controllers/subscription.controller";

router.post("/buy-subscription/:id",buySubscriptionPlan)
router.post("/delete-subscription/:id",cancelSubcription)


export default router;