// utils/pingSite.js
const https = require("https");

async function pingSite(url) {
  const start = Date.now();

  try {
    await new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          res.on("data", () => {});
          res.on("end", resolve);
        })
        .on("error", reject)
        .setTimeout(5000, () => reject(new Error("Timeout")));
    });

    return {
      status: "UP",
      responseTime: Date.now() - start,
    };
  } catch (err) {
    return {
      status: "DOWN",
      responseTime: null,
    };
  }
}

module.exports = { pingSite };
