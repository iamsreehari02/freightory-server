import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000", "https://freightory-dashboard-client-h8ep.vercel.app"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
