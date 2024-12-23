import express from "express";

const app = express();
const port = 3000;

app.get("/order", (req, res) => {
  res.status(200).json({
    sucess: true,
    message: "Order has been created successfully",
  });
});

app.listen(port, () => console.log(`oder Service listening on port ${port}`));
