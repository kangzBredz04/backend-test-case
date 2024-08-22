import express from "express";
import {
  checkPenalty,
  getAllMember,
  getMemberLoanStatus,
} from "../controllers/member-controller.js";

const router = express.Router();

router.get("/get-all", getAllMember);
router.get("/member-loans", getMemberLoanStatus);
router.get("/penalty/:memberCode", checkPenalty);

export default router;
