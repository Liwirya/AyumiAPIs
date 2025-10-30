const express = require("express");
const cors = require("cors");
const path = require("path");
const chalk = require("chalk");
const swaggerUi = require("swagger-ui-express");

const config = require("./schema/config");
const docs = require("./schema/endpoint");
const apiRoutes = require("./router/api");
const { anim } = require("./lib/print");

const app = express();

app.set("trust proxy", 1); 

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=()");
  // Kalo pake framework kayak React/Vue, tambahin 'unsafe-eval' di sini ya
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; font-src 'self'; connect-src 'self'; frame-src 'none';");
  next();
});

app.use(cors({
  origin: config.options.corsOrigins || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Forwarded-For"],
  credentials: true,
  maxAge: 86400,
}));

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    status: false,
    message: "Waduh, request kamu kebanyakan nih. Coba lagi nanti ya.",
    developer: config.options.developer,
  },
});
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const staticDir = path.join(__dirname, "resources");
console.log(chalk.blue(`📁 Static files dari sini: ${staticDir}`));
app.use(express.static(staticDir));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  const fileIndex = path.join(__dirname, "resources", "index.html");
  console.log(chalk.yellow(`📄 Request ke "/", ngirim file: ${fileIndex}`));

  const fs = require("fs");
  if (fs.existsSync(fileIndex)) {
    res.sendFile(fileIndex, (err) => {
      if (err) {
        console.error(chalk.red("[ERROR] Gagal kirim index.html:"), err);
        res.status(500).send("Yah, error pas ngirim file nih.");
      }
    });
  } else {
    console.error(chalk.red(`❌ Nih, file index.html gak ketemu di: ${fileIndex}`));
    res.status(500).send("File index.html gak ada di folder resources.");
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server awake dan ngejalanin tugasnya",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/playground", swaggerUi.serve, swaggerUi.setup(docs.swaggerDocument, docs.options));

app.use((req, res, next) => {
  const file404 = path.join(__dirname, "resources", "404.html");
  console.log(chalk.grey(`📄 404 nih, ngirim file ${file404} buat path: ${req.originalUrl}`));

  const fs = require("fs");
  if (fs.existsSync(file404)) {
    res.status(404).sendFile(file404, (err) => {
      if (err) {
        console.error(chalk.red("[ERROR] Gagal ngirim 404.html:"), err);
        res.status(500).send("Error pas ngirim file 404 atau halaman default.");
      }
    });
  } else {
    res.status(404).send("Waduh, halaman gak ketemu nih!");
  }
});

app.use((err, req, res, next) => {
  console.error("[ERROR] ", err.stack);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || "Internal Server Error",
    developer: config.options.developer,
    timestamp: new Date().toISOString(),
  });
});

const PORT = config.options.port || 1904;

app.listen(PORT, () => {
  console.log(chalk.cyan("HaewonAPIs - Didesain oleh @Liwirya"));
  anim(`Server nyala di http://localhost:${PORT}, cus buruan cek!`);
  console.log(chalk.green("✅ Server siap Jalan"));
  console.log(chalk.yellow("🌐 Swagger UI bisa dicek di: /playground"));
  console.log(chalk.blue("🔧 Cek kondisi server di: /health"));
  console.log(chalk.grey(`💡 Buka aja di browser: http://localhost:${PORT}`));
});

// Event graceful shutdown biar aman pas dimatiin
process.on("SIGINT", () => {
  console.log(chalk.magenta("🛑 Server mau dimatiin, siap-siap shutdown..."));
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(chalk.magenta("🛑 Server dimatiin, sampai jumpa!"));
  process.exit(0);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});