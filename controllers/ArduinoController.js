import Arduino from "../models/ArduinoModel.js";

export const getArduino = async (req, res) => {
  try {
    const response = await Arduino.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getArduinoById = async (req, res) => {
  try {
    const response = await Arduino.findOne({
      where: { id: req.params.id },
    });

    if (!response) {
      return res.status(404).json({ message: "Arduino not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getArduinoByCode = async (req, res) => {
  try {
    const response = await Arduino.findOne({
      where: { verification_code: req.params.verification_code },
    });

    if (!response) {
      return res.status(404).json({ message: "Arduino not found" });
    }

    res.status(200).json({
      message: "Arduino found",
      arduino: {
        id: response.id,
        code: response.verification_code,
        description: response.description,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};


export const createArduino = async (req, res) => {
  try {
    if (!req.body.verification_code) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    const newArduino = await Arduino.create(req.body);
    res.status(201).json({
      message: "Arduino Created",
      data: newArduino,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateArduino = async (req, res) => {
  try {
    const arduino = await Arduino.findByPk(req.params.id);

    if (!arduino) {
      return res.status(404).json({ message: "Arduino not found" });
    }

    await arduino.update(req.body);
    res.status(200).json({ message: "Arduino Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteArduino = async (req, res) => {
  try {
    const arduino = await Arduino.findByPk(req.params.id);

    if (!arduino) {
      return res.status(404).json({ message: "Arduino not found" });
    }

    await arduino.destroy();
    res.status(200).json({ message: "Arduino Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
