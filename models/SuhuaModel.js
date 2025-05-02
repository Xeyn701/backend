import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import moment from 'moment-timezone';

const { DataTypes } = Sequelize;

const Suhua = db.define(
  "suhua_tb",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
      set(value) {
        if (!value || value === "") {
          this.setDataValue("timestamp", moment.tz("Asia/Makassar").toDate());
        } else {
          this.setDataValue("timestamp", value);
        }
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Suhua;

(async () => {
  try {
    await db.sync({ alter: true });
    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
})();
