const express = require("express");
const {
  airQualityCallback,
  airQualityPromise,
} = require("../service/airQualityService");
const URLSearchParams = require("url-search-params");
const router = express.Router();

const app = express();
app.use(router);

// CALLBACK
router.get("/callback", (req, res) => {
  airQualityCallback(process.env.API_URL, (err, data) => {
    if (err) res.status(500).json({ Status: "Failed", Message: err });
    res.status(200).send(data);
  });
});

// PROMISE
router.get("/promise", (req, res) => {
  airQualityPromise(process.env.API_URL)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).json({ Status: "Failed", Message: err });
    });
});

// ASYNC-AWAIT
router.get("/asyncAwait", async (req, res) => {
  try {
    const data = await airQualityPromise(process.env.API_URL);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ Status: "Failed", Message: error });
  }
});

// CALLBACK-HELL
router.get("/callbackHell", (req, res) => {
  let total = [];
  let payload = { page: 1 };
  let searchParams = new URLSearchParams(payload);
  airQualityCallback(
    `${process.env.API_URL}?${searchParams}`,
    (err1, data1) => {
      if (err1) {
        res.status(500).send(err1);
      } else {
        payload.page = payload.page + 1;
        searchParams = new URLSearchParams(payload);
        airQualityCallback(
          `${process.env.API_URL}?${searchParams}`,
          (err2, data2) => {
            if (err2) {
              res.status(500).send(err2);
            } else {
              payload.page = payload.page + 1;
              searchParams = new URLSearchParams(payload);
              airQualityCallback(
                `${process.env.API_URL}?${searchParams}`,
                (err3, data3) => {
                  if (err3) {
                    res.status(500).send(err3);
                  } else {
                    total.push(data1);
                    total.push(data2);
                    total.push(data3);
                    res.status(200).send(total);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// PROMISE NON-HELL
router.get("/promiseNonHell", (req, res) => {
  let payload = { page: 1 };
  let total = [];
  let searchParams = new URLSearchParams(payload);
  airQualityPromise(`${process.env.API_URL}?${payload}`)
    .then((data1) => {
      payload.page = payload.page + 1;
      searchParams = new URLSearchParams(payload);
      airQualityPromise(`${process.env.API_URL}?${searchParams}`)
        .then((data2) => {
          payload.page = payload.page + 1;
          searchParams = new URLSearchParams(payload);
          airQualityPromise(`${process.env.API_URL}?${searchParams}`)
            .then((data3) => {
              total.push(data1);
              total.push(data2);
              total.push(data3);
              res.status(200).send(total);
            })
            .catch((err3) => {
              res.status(500).send(err3);
            });
        })
        .catch((err2) => {
          res.status(500).send(err2);
        });
    })
    .catch((err1) => {
      res.status(500).send(err1);
    });
});

// ASYNC_AWAIT NON HELL
router.get("/asyncAwaitNonHell", async (req, res) => {
  try {
    let total = [];
    let payload = { page: 1 };
    let searchParams = new URLSearchParams(payload);
    const data1 = await airQualityPromise(
      `${process.env.API_URL}?${searchParams}`
    );
    payload.page = payload.page + 1;
    searchParams = new URLSearchParams(payload);
    const data2 = await airQualityPromise(
      `${process.env.API_URL}?${searchParams}`
    );
    payload.page = payload.page + 1;
    searchParams = new URLSearchParams(payload);
    const data3 = await airQualityPromise(
      `${process.env.API_URL}?${searchParams}`
    );
    total.push(data1);
    total.push(data2);
    total.push(data3);
    res.status(200).send(total);
  } catch (err) {
    res.status(500).send(err);
  }
});

// MULTIPLE PROMISES
router.get("/multiplePromises", (req, res) => {
  let total = [];
  let payload = { page: 1 };
  let searchParams = new URLSearchParams(payload);
  //console.log(`${process.env.API_URL}?${searchParams}`);  //  https://api.openaq.org/v2/latest?page=1
  let data1 = airQualityPromise(`${process.env.API_URL}?${searchParams}`);
  payload.page = payload.page + 1;
  searchParams = new URLSearchParams(payload);
  let data2 = airQualityPromise(`${process.env.API_URL}?${searchParams}`);
  payload.page = payload.page + 1;
  searchParams = new URLSearchParams(payload);
  let data3 = airQualityPromise(`${process.env.API_URL}?${searchParams}`);
  Promise.all([data1, data2, data3])
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
  // Promise.race([data1, data2, data3])
  //   .then((data) => res.status(200).send(data))
  //   .catch((err) => res.status(500).send(err));
});

module.exports = router;
