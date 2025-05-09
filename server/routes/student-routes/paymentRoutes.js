import express from "express";
import { checkout, paymentVerification } from "../../controllers/student-controller/paymentContoller.js";

const router=express.Router();

router.route("/checkout").post(checkout);
router.route("/paymentVerification").post(paymentVerification);

export default router;
