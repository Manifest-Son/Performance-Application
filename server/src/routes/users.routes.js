import {Router} from "express"

const router = Router()

router.get("/", (req,res) => {
    res.send("I am displaying on port 3000")
})
router.post("/", (req,res) => {
    res.send("I am displaying on port 3000")
})
router.patch("/", (req,res) => {
    res.send("I am displaying on port 3000")
})
router.delete("/", (req,res) => {
    res.send("I am displaying on port 3000")
})

export default router