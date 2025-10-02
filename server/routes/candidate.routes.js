import express from "express";
import { addCandidate, deleteCandidate, getCandidate, updateCandidate } from "../controllers/candidate.controller.js";


const router = express.Router();

router.post("/", addCandidate);
router.get("/", getCandidate);
router.patch("/:id", updateCandidate);    
router.delete("/:id", deleteCandidate);

export default router;