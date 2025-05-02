import Tds from "../models/TdsModel.js";

export const getTds = async (req, res) => {
    try {
      const response = await Tds.findAll({
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getTdsById = async (req, res) => {
    try {
      const response = await Tds.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "Tds not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getTdsByCode = async (req, res) => {
    try {
        const response = await Tds.findAll({
            where: {
                verification_code: req.params.verification_code,
            },
            order: [['timestamp', 'DESC']]
        });

        if (!response.length) { 
            return res.status(404).json({ message: "Tds code not found" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createTds = async(req, res) =>{
    try {
        await Tds.create(req.body);
        res.status(201).json({msg: "Tds Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateTds = async(req, res) =>{
    try {
        await Tds.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Tds Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteTds = async(req, res) =>{
    try {
        await Tds.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Tds Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}