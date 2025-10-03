import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import candidateRoutes from './routes/candidate.routes.js';
import clientRoutes from './routes/client.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import reportRoutes from './routes/report.routes.js';
import helmet from "helmet";
import morgan from "morgan";
dotenv.config()

const app = express();
const port = process.env.PORT || 4000

app.use(cors({
  origin: "https://staff-management-system-delta.vercel.app",
  credentials: true  
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...")
});


app.use('/api/v1/candidate', candidateRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/client",  clientRoutes);
app.use("/api/v1/report", reportRoutes);



app.listen(port, () => console.log("Server is running... "));
