import express from "express";
import {
    getSuhua, 
    getSuhuaById,
    createSuhua,
    updateSuhua,
    deleteSuhua
} from "../controllers/SuhuaController.js";

const router = express.Router();

router.get('/suhua', getSuhua);
router.get('/suhua/:id', getSuhuaById);
router.post('/suhua', createSuhua);
router.patch('/suhua/:id', updateSuhua);
router.delete('/suhua/:id', deleteSuhua);

export default router;
