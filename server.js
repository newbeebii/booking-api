const express = require("express");
const pool = require("./config/db");
const dotenv = require("dotenv");
const port = process.env.PORT;
const fieldRoutes = require("./routes/fieldRoutes");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

//FIELD ROUTES
app.use("/api/fields", fieldRoutes);
app.get("/", async (req, res) => {
  res.json({ message: "Server Jalan" });
});

//BOOKING ROUTES
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
