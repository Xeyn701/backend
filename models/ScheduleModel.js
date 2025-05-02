import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const ScheduleModel = db.define(
  "schedule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    relayId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    startTime: {
      type: DataTypes.STRING,
      defaultValue: "08:00",
    },
    endTime: {
      type: DataTypes.STRING,
      defaultValue: "18:00",
    },
  },
  {
    freezeTableName: true,
  }
);

export default ScheduleModel;
