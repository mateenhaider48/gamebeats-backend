import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes"
import cors from "cors"
import subscription from "./routes/subscription.route"
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


// Enable CORS
app.use(cors({
  origin: "https://gamebeats-frontend.vercel.app", // frontend origin
  credentials: true, // allow cookies to be sent
}));
app.use("/api/auth",authRoutes)
app.use("/api/subscription", subscription)



export default app;
