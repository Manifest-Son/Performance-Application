import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./src/routes/users.routes.js";
import tasksRouter from "./src/routes/tasks.routes.js";
import notificationsRouter from "./src/routes/notifications.routes.js";
import departmentsRouter from "./src/routes/department.routes.js";
import evaluationsRouter from "./src/routes/evaluations.routes.js";
import { cookie } from "express-validator";

const app = express();
const port = 3000;

config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/notifications", notificationsRouter);
app.use("/departments", departmentsRouter);
app.use("/evaluations", evaluationsRouter);

app.listen(port, () => {
  console.log(`Server is running on port 3000...`);
});
