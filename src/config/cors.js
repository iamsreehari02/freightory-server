import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000", "https://app.indlognetwork.com"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
