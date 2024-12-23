import express from "express";
import axios from "axios";

const app = express();
const port = 3001;

app.get("/product", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3002/user");
    res.status(200).json({
      message: "This is a product service",
      userData: response.data,
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.listen(port, () => console.log(`Product app listening on port ${port}`));
