const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); 

dotenv.config(); 

const MONGO_URL = process.env.MONGOURL;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(require("./router/ProfileRoute"))
app.use(require('./router/Request'));

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("DATABASE CONNECTED OK");
});

mongoose.connection.on("error", (err) => {
  console.error("DATABASE CONNECTION ERROR:", err);
});



require('./models/Profile');
require('./models/Deal');
require('./models/ProfilePost');
require("./models/Request");



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
