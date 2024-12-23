import express from "express";

const app = express();
const port = 3002;

app.get("/user", (req, res) => {
  res.status(200).json({
    sucess: true,
    message: "User created successfully",
  });
});

app.listen(port, () => console.log(`user apps listening on port ${port}`));
