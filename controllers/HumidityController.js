import Humidity from "../models/HumidityModel.js";

export const getHumidity = async (req, res) => {
    try {
      const response = await Humidity.findAll({
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getHumidityById = async (req, res) => {
    try {
      const response = await Humidity.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "Humidity not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getHumidityByCode = async (req, res) => {
    try {
        const response = await Humidity.findAll({
            where: {
                verification_code: req.params.verification_code,
            },
            order: [['timestamp', 'DESC']]
        });

        if (!response.length) { 
            return res.status(404).json({ message: "Humidity code not found" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createHumidity = async(req, res) =>{
    try {
        await Humidity.create(req.body);
        res.status(201).json({msg: "Humidity Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateHumidity = async(req, res) =>{
    try {
        await Humidity.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Humidity Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteHumidity = async(req, res) =>{
    try {
        await Humidity.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Humidity Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}