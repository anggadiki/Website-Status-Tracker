const axios = require("axios");

async function pingSite(url) {
  try {
    const start = Date.now();
    await axios.get(url, { timeout: 5000 });
    const responseTime = Date.now() - start;
    return { status: "UP", responseTime };
  } catch (err) {
    return { status: "DOWN", responseTime: null };
  }
}

module.exports = { pingSite };
