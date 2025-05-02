import express from "express";
import { 
  getSchedules, 
  getScheduleById, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  findOrUpdateByRelayId,
  getScheduleByRelayId 
} from "../controllers/ScheduleController.js";

const router = express.Router();

router.get("/schedule/", getSchedules);
router.get("/schedule/:id", getScheduleById);
router.post("/schedule/", createSchedule);
router.put("/schedule/:id", updateSchedule);
router.delete("/schedule/:id", deleteSchedule);

router.get("/schedule/relay/:relayId", getScheduleByRelayId); 
router.put("/schedule/relay/:relayId", findOrUpdateByRelayId); 

export default router;
