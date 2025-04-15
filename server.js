const  express = require('express');
const mongoose = require('mongoose');
const app = express();
require("dotenv").config();
const bodyParser = require('body-parser');

const userRoutes = require('./Routes/UserRoutes');
const taskRoutes = require('./Routes/TaskRoutes');


app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("Backend API is running");
  });

  mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database has been connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
