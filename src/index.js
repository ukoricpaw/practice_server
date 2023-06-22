const express = require('express');
const app = express();
require("dotenv").config();
const sequelize = require("./db");
const models = require('./models/models');
const cors = require('cors')
const router = require("./routers/router")
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware")
const fileUpload = require("express-fileupload")
const PORT = process.env.PORT || 5000
const path = require('path')

app.use(cors());
app.use(express.json());
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, "static")))
app.use("/api", router);
app.use(errorHandlerMiddleware)


const sync = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log("запущен на порту", PORT)
  })
}

sync();