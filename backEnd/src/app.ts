import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
const usersRoute = require("./routes/usersRoute");
const commentRoute = require("./routes/commentsRoutes");

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(usersRoute.routes);
app.use(commentRoute.routes);
