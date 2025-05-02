import express from "express";
import {
    getTds, 
    getTdsById,
    createTds,
    updateTds,
    deleteTds
} from "../controllers/TdsController.js";

const router = express.Router();

router.get('/tds', getTds);
router.get('/tds/:id', getTdsById);
router.post('/tds', createTds);
router.patch('/tds/:id', updateTds);
router.delete('/tds/:id', deleteTds);

export default router;
