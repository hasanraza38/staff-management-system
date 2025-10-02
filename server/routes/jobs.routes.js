import express from "express";
import { assignJobToCand, deleteJob, getJobs, postJob, removeAssignment, updateJob } from "../controllers/job.controller.js";

const router = express.Router();


router.post("/", postJob);
router.get("/" ,getJobs);
router.post("/:jobId/assign", assignJobToCand);
router.delete("/:jobId/remove/:candidateId", removeAssignment);
router.patch("/:id", updateJob);           
router.delete("/:id", deleteJob);


export default router