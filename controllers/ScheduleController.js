import ScheduleModel from '../models/ScheduleModel.js';

export const getSchedules = async (req, res) => {
  try {
    const whereConditions = {};
    
    if (req.query.relayId) {
      whereConditions.relayId = req.query.relayId;
    }
    
    const schedules = await ScheduleModel.findAll({
      where: whereConditions
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await ScheduleModel.findOne({
      where: { id: req.params.id }
    });
    if (!schedule)
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSchedule = async (req, res) => {
  try {
    
    // Ensure enabled is properly treated as boolean
    const createData = {...req.body};
    
    // Explicitly handle the enabled property
    if ('enabled' in createData) {
      createData.enabled = createData.enabled === true || 
                          createData.enabled === 1 || 
                          createData.enabled === 'true';
      
    }
    
    const newSchedule = await ScheduleModel.create(createData);
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error creating schedule:", error.message);
    res.status(500).json({ message: "Failed to create schedule", error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updateData = {...req.body};
    
    if ('enabled' in updateData) {
      updateData.enabled = updateData.enabled === true || 
                          updateData.enabled === 1 || 
                          updateData.enabled === 'true';
    }
    
    const schedule = await ScheduleModel.findOne({
      where: { id: req.params.id }
    });
    
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    
    if (updateData.relayId && updateData.relayId !== schedule.relayId) {
      
      const existingScheduleForRelay = await ScheduleModel.findOne({
        where: { relayId: updateData.relayId }
      });
      
      if (existingScheduleForRelay) {
        console.log(`A schedule already exists for relay ${updateData.relayId}. Avoid creating duplicate schedules.`);
      }
    }
    
        const [updated] = await ScheduleModel.update(updateData, {
      where: { id: req.params.id }
    });
    
    
    const updatedSchedule = await ScheduleModel.findOne({
      where: { id: req.params.id }
    });
    
    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    res.status(500).json({ message: "Failed to update schedule", error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    await ScheduleModel.destroy({
      where: { id: req.params.id }
    });
    res.status(200).json({ message: "Schedule deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to delete schedule" });
  }
};

export const getScheduleByRelayId = async (req, res) => {
  try {
    const { relayId } = req.params;
    
    const schedule = await ScheduleModel.findOne({
      where: { relayId }
    });
    
    if (!schedule) {
      return res.status(404).json({ 
        message: "No schedule found for this relay",
        relayId 
      });
    }
    
    console.log(`Found schedule for relayId ${relayId}:`, JSON.stringify(schedule.toJSON()));
    return res.status(200).json(schedule);
  } catch (error) {
    console.error(`Error getting schedule for relayId ${req.params.relayId}:`, error.message);
    res.status(500).json({ 
      message: "Failed to get schedule", 
      error: error.message 
    });
  }
};

export const findOrUpdateByRelayId = async (req, res) => {
  try {
    const { relayId } = req.params;
    console.log(`Finding or updating schedule for relayId: ${relayId}`);
    const scheduleData = {...req.body};
    
    if ('enabled' in scheduleData) {
      const originalValue = scheduleData.enabled;
      scheduleData.enabled = scheduleData.enabled === true || 
                             scheduleData.enabled === 1 || 
                             scheduleData.enabled === 'true';
      
    }
    
    let schedule = await ScheduleModel.findOne({
      where: { relayId }
    });
    
    if (schedule) {
      
      const [updatedCount] = await ScheduleModel.update(scheduleData, {
        where: { relayId }
      });
            
      schedule = await ScheduleModel.findOne({
        where: { relayId }
      });
      
      console.log(`After update verification: enabled=${schedule.enabled}, startTime=${schedule.startTime}, endTime=${schedule.endTime}`);
      return res.status(200).json(schedule);
    } else {
      console.log(`No schedule found for relayId: ${relayId}. Creating new with enabled=${scheduleData.enabled || false}`);
      scheduleData.relayId = relayId;
      
      if (!('startTime' in scheduleData)) scheduleData.startTime = "08:00";
      if (!('endTime' in scheduleData)) scheduleData.endTime = "18:00";
      if (!('enabled' in scheduleData)) scheduleData.enabled = false;
      
      const newSchedule = await ScheduleModel.create(scheduleData);
      return res.status(201).json(newSchedule);
    }
  } catch (error) {
    if (error.original) {
      console.error("SQL Error:", error.original.message);
    }
    res.status(500).json({ message: "Failed to process schedule", error: error.message });
  }
};
