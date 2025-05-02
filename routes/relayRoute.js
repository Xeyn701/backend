import express from "express";
import {
    getRelay, 
    getRelayById,
    createRelay,
    updateRelay,
    deleteRelay
} from "../controllers/RelayController.js";

const router = express.Router();

router.get('/relay', getRelay);
router.get('/relay/:id', getRelayById);
router.post('/relay', createRelay);
router.patch('/relay/:id', updateRelay);
router.delete('/relay/:id', deleteRelay);

export default router;
