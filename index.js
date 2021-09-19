require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require("./router/index");
const errorMiddlewares = require("./middlewares/error-middleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/v1", router);
// ! Error middleware must be in the end of middlewares chain
app.use(errorMiddlewares)

const serverStart = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true
    })
      .catch(error => console.error(error));
    app.listen(PORT, () => console.log(`Server has been started on PORT => ${PORT}`))
  } catch (error) {
    console.log(error);
  }
}

serverStart();