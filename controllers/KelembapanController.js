import Kelembapan from "../models/KelembapanModel.js";

export const getKelembapan = async (req, res) => {
    try {
      const response = await Kelembapan.findAll({
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getKelembapanById = async (req, res) => {
    try {
      const response = await Kelembapan.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "Kelembapan not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getKelembapanByCode = async (req, res) => {
    try {
        const response = await Kelembapan.findAll({
            where: {
                verification_code: req.params.verification_code,
            },
            order: [['timestamp', 'DESC']]
        });

        if (!response.length) { 
            return res.status(404).json({ message: "Kelembapan code not found" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createKelembapan = async(req, res) =>{
    try {
        await Kelembapan.create(req.body);
        res.status(201).json({msg: "Kelembapan Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateKelembapan = async(req, res) =>{
    try {
        await Kelembapan.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Kelembapan Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteKelembapan = async(req, res) =>{
    try {
        await Kelembapan.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Kelembapan Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}