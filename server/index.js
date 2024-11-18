import express from "express";
import usersRouter from "./src/routes/users.routes.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port 3000...`);
});
