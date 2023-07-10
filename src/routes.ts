import "dotenv/config";
import express, { Request, Response } from "express";

import bookcontroller from "./controllers/bookController";
import authController from "./controllers/authController";
import loanController from "./controllers/loanController";

const router = express.Router();

router.use("/book", bookcontroller);
router.use("/loans", loanController);
router.use("/", authController);

export default router;
