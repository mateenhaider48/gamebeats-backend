import dotenv from "dotenv";

// Load env variables only for local development
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config();
}
import connectDB from "./configs/db.config";
import app from "./app";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
