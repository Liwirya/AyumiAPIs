const express = require("express");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const config = require("../schema/config");
const tools = require("../scrapers/tools.js");
const ai = require("../scrapers/ai.js");

const { developer: dev } = config.options;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1424134853502308453/MysoAxFaXtd94iBGBhqCa3tDUb0yYrxOZ0ZEATN76-NAj1iw3X30-FHjU0Az9jaJz8CR";

if (!DISCORD_WEBHOOK_URL) {
  console.warn("⚠️ Bro, Discord webhook belum ke-set nih, log gak bakal ke-kirim.");
}

const messages = {
  error: { status: 404, developer: dev, result: "Error, Service lagi gak available nih." },
  notRes: { status: 404, developer: dev, result: "Error, JSON hasilnya nggak valid." },
  query: { status: 400, developer: dev, result: "Bro, jangan lupa masukin parameter query ya!" },
  url: { status: 400, developer: dev, result: "Eh, input parameter URL dulu dong!" },
  notUrl: { status: 404, developer: dev, result: "Error, URL-nya gak valid nih." },
};

// Cek query-nya, jangan sampe kosong, bro
const validateQuery = (req, res, next) => {
  const { query } = req.query;
  if (!query) return res.status(messages.query.status).json(messages.query);
  next();
};

// Setup storage buat upload file
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Cari IP asli user, jangan sampe ketipu
const getRealIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const socket = req.socket;
  if (socket?.remoteAddress) return socket.remoteAddress;
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || "unknown";
};

// Kirim log ke Discord, biar gaul dan tercatat rapi
const sendDiscordLog = async (data) => {
  if (!DISCORD_WEBHOOK_URL) return;

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: null,
      embeds: [{
        title: "🔐 API Access Detected",
        color:
          data.status === "error" ? 0xff0000 :
          data.status === "success" ? 0x00ff9d :
          0x00c7ff,
        fields: [
          { name: "IP Address", value: data.ip, inline: true },
          { name: "Method", value: data.method, inline: true },
          { name: "Endpoint", value: data.endpoint, inline: true },
          { name: "Status", value: data.status, inline: true },
          { name: "Time", value: new Date().toISOString(), inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: `HaewonAPIs | ${dev}` },
      }],
    });
  } catch (err) {
    console.error("❌ Gagal kirim log ke Discord, bro:", err.message);
  }
};

// Daftar IP yang dilarang, jangan sampe nyelip
const bannedIps = ["127.0.0.1", "0.0.0.0", "localhost", "192.168.1.100", "192.168.0.1", "10.0.0.1"];

// Sanitasi input biar aman, gak kacau nanti
const sanitizeInput = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/[<>"'&]/g, "");
};

// Route buat ngecek speedtest, simpel banget bro
router.get("/tools/speedtest", async (req, res) => {
  const ip = getRealIp(req);
  const method = req.method;
  const endpoint = req.url;
  let { query } = req.query;
  query = sanitizeInput(query);

  if (bannedIps.includes(ip)) {
    await sendDiscordLog({ ip, method, endpoint, status: "blocked", reason: "Banned IP" });
    return res.status(403).json({ status: false, message: "Access denied, IP kamu diblokir.", developer: dev });
  }

  await sendDiscordLog({ ip, method, endpoint, status: "request", query });
  console.log(`[REQUEST] ${new Date().toISOString()} - ${method} ${endpoint}`);

  // Query cuma bisa 'upload' atau 'ping' aja ya, bro
  if (query && !["upload", "ping"].includes(query.toLowerCase())) {
    await sendDiscordLog({ ip, method, endpoint, status: "invalid_query", query });
    return res.status(400).json({
      status: false,
      message: "Query salah bro, cuma boleh 'upload' atau 'ping'.",
      developer: dev,
    });
  }

  try {
    const result = await tools.speedtest(query);

    if (!result || typeof result !== "object") throw new Error("Service speedtest ngasih format error nih");

    res.status(200).json({ status: true, developer: dev, result });
    await sendDiscordLog({ ip, method, endpoint, status: "success", query });
    console.log(`[SUCCESS] Speedtest kelar di ${new Date().toISOString()}`);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || "Internal Server Error";
    
    console.error(`[ERROR] ${new Date().toISOString()} - ${endpoint}:`, errorMessage);

    await sendDiscordLog({ ip, method, endpoint, status: "error", error: errorMessage });
    res.status(statusCode).json({ status: false, message: errorMessage, developer: dev });
  }
});

// Route AI buat Google Search, jangan lupa query-nya bro
router.get("/ai/google-search", validateQuery, async (req, res) => {
  const ip = getRealIp(req);
  const method = req.method;
  const endpoint = req.url;
  let { query } = req.query;
  query = sanitizeInput(query);

  if (bannedIps.includes(ip)) {
    await sendDiscordLog({ ip, method, endpoint, status: "blocked", reason: "Banned IP" });
    return res.status(403).json({ status: false, message: "Access denied, IP diblokir.", developer: dev });
  }

  await sendDiscordLog({ ip, method, endpoint, status: "request", query });
  
  try {
    const result = await ai.googleSearch(query);

    if (!result) throw new Error("Google Search AI gak merespon nih");

    res.status(200).json({ status: true, developer: dev, result });
    await sendDiscordLog({ ip, method, endpoint, status: "success", query });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || "Internal Server Error";

    console.error(`[ERROR] ${new Date().toISOString()} - ${endpoint}:`, errorMessage);

    await sendDiscordLog({ ip, method, endpoint, status: "error", error: errorMessage });
    res.status(statusCode).json({ status: false, message: errorMessage, developer: dev });
  }
});

// Route AI buat ngejalanin kode google execute, tetep jangan lupa query bro
router.get("/ai/google-execute", validateQuery, async (req, res) => {
  const ip = getRealIp(req);
  const method = req.method;
  const endpoint = req.url;
  let { query } = req.query;
  query = sanitizeInput(query);

  if (bannedIps.includes(ip)) {
    await sendDiscordLog({ ip, method, endpoint, status: "blocked", reason: "Banned IP" });
    return res.status(403).json({ status: false, message: "Access denied, IP diblokir.", developer: dev });
  }

  await sendDiscordLog({ ip, method, endpoint, status: "request", query });

  try {
    const result = await ai.googleExecuteCode(query);

    if (!result) throw new Error("Google Execute Code AI gak merespon nih");

    res.status(200).json({ status: true, developer: dev, result });
    await sendDiscordLog({ ip, method, endpoint, status: "success", query });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || "Internal Server Error";

    console.error(`[ERROR] ${new Date().toISOString()} - ${endpoint}:`, errorMessage);

    await sendDiscordLog({ ip, method, endpoint, status: "error", error: errorMessage });
    res.status(statusCode).json({ status: false, message: errorMessage, developer: dev });
  }
});

// Lokasi preset, biar gampang pake koordinat pas request
const presetLocations = {
  // Amerika Utara
  "san-francisco": { latitude: 37.78193, longitude: -122.40476 },
  "los-angeles": { latitude: 34.0522, longitude: -118.2437 },
  "new-york": { latitude: 40.7128, longitude: -74.006 },
  "chicago": { latitude: 41.8781, longitude: -87.6298 },
  "houston": { latitude: 29.7604, longitude: -95.3698 },
  "toronto": { latitude: 43.65107, longitude: -79.347015 },
  "vancouver": { latitude: 49.2827, longitude: -123.1207 },
  "mexico-city": { latitude: 19.4326, longitude: -99.1332 },

  // Amerika Selatan
  "sao-paulo": { latitude: -23.5505, longitude: -46.6333 },
  "rio-de-janeiro": { latitude: -22.9068, longitude: -43.1729 },
  "buenos-aires": { latitude: -34.6037, longitude: -58.3816 },
  "lima": { latitude: -12.0464, longitude: -77.0428 },
  "bogota": { latitude: 4.711, longitude: -74.0721 },

  // Eropa
  "london": { latitude: 51.5074, longitude: -0.1278 },
  "paris": { latitude: 48.8566, longitude: 2.3522 },
  "berlin": { latitude: 52.52, longitude: 13.405 },
  "madrid": { latitude: 40.4168, longitude: -3.7038 },
  "rome": { latitude: 41.9028, longitude: 12.4964 },
  "amsterdam": { latitude: 52.3676, longitude: 4.9041 },
  "moscow": { latitude: 55.7558, longitude: 37.6173 },
  "vienna": { latitude: 48.2082, longitude: 16.3738 },
  "zurich": { latitude: 47.3769, longitude: 8.5417 },
  "stockholm": { latitude: 59.3293, longitude: 18.0686 },

  // Asia
  "jakarta": { latitude: -6.2088, longitude: 106.8456 },
  "bandung": { latitude: -6.9175, longitude: 107.6191 },
  "surabaya": { latitude: -7.2575, longitude: 112.7521 },
  "bali": { latitude: -8.4095, longitude: 115.1889 },
  "yogyakarta": { latitude: -7.7956, longitude: 110.3695 },
  "medan": { latitude: 3.5952, longitude: 98.6722 },
  "makassar": { latitude: -5.1477, longitude: 119.4327 },
  "semarang": { latitude: -6.9667, longitude: 110.4167 },
  "singapore": { latitude: 1.3521, longitude: 103.8198 },
  "bangkok": { latitude: 13.7563, longitude: 100.5018 },
  "kuala-lumpur": { latitude: 3.139, longitude: 101.6869 },
  "manila": { latitude: 14.5995, longitude: 120.9842 },
  "tokyo": { latitude: 35.6895, longitude: 139.6917 },
  "osaka": { latitude: 34.6937, longitude: 135.5023 },
  "seoul": { latitude: 37.5665, longitude: 126.978 },
  "beijing": { latitude: 39.9042, longitude: 116.4074 },
  "shanghai": { latitude: 31.2304, longitude: 121.4737 },
  "hong-kong": { latitude: 22.3193, longitude: 114.1694 },
  "taipei": { latitude: 25.033, longitude: 121.5654 },
  "hanoi": { latitude: 21.0285, longitude: 105.8542 },
  "delhi": { latitude: 28.6139, longitude: 77.209 },
  "mumbai": { latitude: 19.076, longitude: 72.8777 },
  "dubai": { latitude: 25.276987, longitude: 55.296249 },
  "riyadh": { latitude: 24.7136, longitude: 46.6753 },
  "istanbul": { latitude: 41.0082, longitude: 28.9784 },

  // Afrika
  "cairo": { latitude: 30.0444, longitude: 31.2357 },
  "nairobi": { latitude: -1.2921, longitude: 36.8219 },
  "lagos": { latitude: 6.5244, longitude: 3.3792 },
  "cape-town": { latitude: -33.9249, longitude: 18.4241 },
  "johannesburg": { latitude: -26.2041, longitude: 28.0473 },

  // Oseania
  "sydney": { latitude: -33.8688, longitude: 151.2093 },
  "melbourne": { latitude: -37.8136, longitude: 144.9631 },
  "brisbane": { latitude: -27.4698, longitude: 153.0251 },
  "perth": { latitude: -31.9505, longitude: 115.8605 },
  "auckland": { latitude: -36.8485, longitude: 174.7633 },
  "wellington": { latitude: -41.2865, longitude: 174.7762 },

  // Kepulauan khusus
  "honolulu": { latitude: 21.3069, longitude: -157.8583 },
  "maldives": { latitude: 3.2028, longitude: 73.2207 },
  "fiji": { latitude: -17.7134, longitude: 178.065 },
  "papua": { latitude: -4.2699, longitude: 138.0804 }
};

// Route AI buat generate Google Maps, pake lokasi preset juga bisa bro
router.get("/ai/google-maps", validateQuery, async (req, res) => {
  const ip = getRealIp(req);
  const method = req.method;
  const endpoint = req.url;
  let { query, location } = req.query;

  query = sanitizeInput(query);
  location = sanitizeInput(location);

  if (bannedIps.includes(ip)) {
    await sendDiscordLog({ ip, method, endpoint, status: "blocked", reason: "Banned IP" });
    return res.status(403).json({
      status: false,
      message: "Access denied, IP kamu diblokir.",
      developer: dev,
    });
  }

  await sendDiscordLog({ ip, method, endpoint, status: "request", query });

  const latLng = location && presetLocations[location] ? presetLocations[location] : null;

  try {
    const result = await ai.googleMapsGenerate(query, latLng);

    if (!result) throw new Error("Google Maps AI gak merespon nih.");

    res.status(200).json({
      status: true,
      developer: dev,
      result,
    });
    await sendDiscordLog({ ip, method, endpoint, status: "success", query });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.message || "Internal Server Error";

    console.error(`[ERROR] ${new Date().toISOString()} - ${endpoint}:`, errorMessage);

    await sendDiscordLog({ ip, method, endpoint, status: "error", error: errorMessage });
    res.status(statusCode).json({
      status: false,
      message: errorMessage,
      developer: dev,
    });
  }
});

// Health check endpoint, API sehat bro
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "API Gateway",
    uptime: process.uptime(),
  });
});

// Kalau endpoint gak ketemu, kasih tau jangan sampe bingung bro
router.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Waduh, endpoint gak ada nih bro.", developer: dev });
});

module.exports = router;