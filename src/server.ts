import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

routes.map((route) => app.use(route.path, route.router));

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
