const fs = require('fs');
const path = require("path");

const staticPath = path.resolve(__dirname, "..", "static")

const deleteAsync = (fileName) => new Promise((resolve, reject) => {
  fs.rm(path.resolve(staticPath, fileName), (err) => {
    if (err) {
      return reject();
    }
    resolve();
  })
})


module.exports = deleteAsync;