const { default: axios } = require("axios");

function airQualityCallback(url, callback) {
  axios
    .get(url)
    .then((response) => {
      callback(null, response.data);
    })
    .catch((err) => {
      callback(err, null);
    });
}

function airQualityPromise(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

module.exports = { airQualityCallback, airQualityPromise };
