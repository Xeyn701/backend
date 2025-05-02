import User from "../models/UserModel.js";

export const getUsers = async (req, res) => {
    try {
      const response = await User.findAll({
        attributes: ["id", "name","username", "email", "user_role", "verification_code",], 
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getUserById = async (req, res) => {
    try {
      const response = await User.findOne({
        attributes: ["id", "name","username", "email", "user_role", "verification_code",], 
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const createUser = async(req, res) =>{
    try {
        await User.create(req.body);
        res.status(201).json({msg: "User Created"});
    } catch (error) {
        console.log(error.message);
    }
}

export const updateUser = async(req, res) =>{
    try {
        await User.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteUser = async(req, res) =>{
    try {
        await User.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        console.log(error.message);
    }
}