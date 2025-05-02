import Relay from "../models/RelayModel.js";

export const getRelay = async (req, res) => {
    try {
      const response = await Relay.findAll({
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getRelayById = async (req, res) => {
    try {
      const response = await Relay.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "Relay not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const createRelay = async(req, res) =>{
    try {
        await Relay.create(req.body);
        res.status(201).json({msg: "Relay Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateRelay = async(req, res) =>{
    try {
        await Relay.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Relay Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteRelay = async(req, res) =>{
    try {
        await Relay.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Relay Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}