import express from "express";
import {
    getPh, 
    getPhById,
    createPh,
    updatePh,
    deletePh
} from "../controllers/PhController.js";

const router = express.Router();

router.get('/ph', getPh);
router.get('/ph/:id', getPhById);
router.post('/ph', createPh);
router.patch('/ph/:id', updatePh);
router.delete('/ph/:id', deletePh);

export default router;
