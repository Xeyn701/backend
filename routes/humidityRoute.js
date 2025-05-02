import express from "express";
import {
    getHumidity, 
    getHumidityById,
    createHumidity,
    updateHumidity,
    deleteHumidity
} from "../controllers/HumidityController.js";

const router = express.Router();

router.get('/humidity', getHumidity);
router.get('/humidity/:id', getHumidityById);
router.post('/humidity', createHumidity);
router.patch('/humidity/:id', updateHumidity);
router.delete('/humidity/:id', deleteHumidity);

export default router;
