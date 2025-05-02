import Ph from "../models/PhModel.js";

export const getPh = async (req, res) => {
    try {
      const response = await Ph.findAll({
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getPhById = async (req, res) => {
    try {
      const response = await Ph.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "Ph not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getPhByCode = async (req, res) => {
    try {
        const response = await Ph.findAll({
            where: {
                verification_code: req.params.verification_code,
            },
            order: [['timestamp', 'DESC']]
        });

        if (!response.length) { 
            return res.status(404).json({ message: "Ph code not found" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createPh = async(req, res) =>{
    try {
        await Ph.create(req.body);
        res.status(201).json({msg: "Ph Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updatePh = async(req, res) =>{
    try {
        await Ph.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Ph Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deletePh = async(req, res) =>{
    try {
        await Ph.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Ph Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}