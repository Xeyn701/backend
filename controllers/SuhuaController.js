import Suhua from "../models/SuhuaModel.js";

export const getSuhua = async (req, res) => {
    try {
      const response = await Suhua.findAll({
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getSuhuaById = async (req, res) => {
    try {
      const response = await Suhua.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "Suhu air not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const createSuhua = async(req, res) =>{
    try {
        await Suhua.create(req.body);
        res.status(201).json({msg: "Suhu air Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateSuhua = async(req, res) =>{
    try {
        await Suhua.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Suhu air Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteSuhua = async(req, res) =>{
    try {
        await Suhua.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Suhu air Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}