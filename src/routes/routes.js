import { Router } from "express";
import { FileUpload, getAllFiles } from "../controllers/filecontroller.js";
import upload from '../middlewares/multermiddleware.js';

const router = Router();

router.route("/upload").post(upload.single('file'),FileUpload);
router.route("/retrieve").get(getAllFiles);

export default router;
