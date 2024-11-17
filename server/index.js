import express from 'express'
import userRouter from './src/routes/users.routes.js';

const app = express();

app.use("/", userRouter)
// app.use("/", (req, res) => {
//     res.send("This is me on port 3000.")
// } )

app.listen(3000, "Our server is running on port 3000...")
