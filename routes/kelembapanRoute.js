import express from "express";
import {
    getKelembapan, 
    getKelembapanById,
    createKelembapan,
    updateKelembapan,
    deleteKelembapan
} from "../controllers/KelembapanController.js";

const router = express.Router();

router.get('/kelembapan', getKelembapan);
router.get('/kelembapan/:id', getKelembapanById);
router.post('/kelembapan', createKelembapan);
router.patch('/kelembapan/:id', updateKelembapan);
router.delete('/kelembapan/:id', deleteKelembapan);

export default router;
