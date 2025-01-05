import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index'); // Just specify the template name, no need for path or extension
});

export default router;