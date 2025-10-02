import express from "express";
import { addClient, deleteClient, getClients, updateClient } from "../controllers/client.controller.js";


const router = express.Router();


router.post("/", addClient );
router.get("/",getClients);
router.patch("/:id", updateClient);    
router.delete("/:id", deleteClient);

export default router