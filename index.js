import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import UserRoute from "./routes/UserRoute.js";
import scheduleRoute from "./routes/scheduleRoute.js";
import authRoute from "./routes/authRoute.js";
import humidityRoute from "./routes/humidityRoute.js";
import phRoute from "./routes/phRoute.js";
import relayRoute from "./routes/relayRoute.js";
import tdsRoute from "./routes/tdsRoute.js";
import kelembapanRoute from "./routes/kelembapanRoute.js";
import suhuaRoute from "./routes/suhuaRoute.js";
import db, { testConnection } from "./config/Database.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);
app.use(scheduleRoute);
app.use(authRoute);
app.use(humidityRoute);
app.use(phRoute);
app.use(relayRoute);
app.use(tdsRoute);
app.use(kelembapanRoute);
app.use(suhuaRoute);
(async () => {
  try {
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error("Server started but database connection failed.");
    } else {
      try {
        await db.sync();
        console.log("Database synchronized successfully");
      } catch (syncError) {
        console.error("Failed to synchronize database:", syncError.message);
      }
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server up and running on port ${PORT}...`));
    
  } catch (error) {
    console.error("Failed to initialize application:", error.message);
  }
})();
