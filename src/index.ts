if (process.env.NODE_ENV !== "PRODUCTION") {
  import('dotenv').then(dotenv => dotenv.config());
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
