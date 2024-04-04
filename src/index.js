require("dotenv").config();
const express = require("express");
const port = process.env.PORT;
const airQualityController = require("./controller/airQualityController");
const router = express.Router();

const app = express();
app.use(router);

router.use("/airQualities", airQualityController);

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server started at port ${port}`);
  } else {
    console.log(`Internal server error occured`);
  }
});
