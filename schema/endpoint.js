const swaggerUi = require("swagger-ui-express");
const config = require("./config");
const { SwaggerTheme, SwaggerThemeNameEnum } = require("swagger-themes");

const theme = new SwaggerTheme();
const customCss = `
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    color: #e0e0e0;
    background: linear-gradient(135deg, #0a0a0a, #1a1a1a, #0a0a0a);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    overflow-x: hidden;
    min-height: 100vh;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .topbar {
    display: none !important;
  }

  .main-container {
    background: rgba(25, 25, 25, 0.85);
    border-radius: 1.5rem;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    margin-top: 2rem;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1;
    transition: all 0.3s ease-in-out;
  }

  .main-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(1px 1px at 0 0, #222 1px, transparent 0) 0 0 repeat;
    opacity: 0.05;
    z-index: -1;
  }

  .content {
    background-color: #121212;
    padding: 2.5rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
    max-width: 100%;
    overflow: auto;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #00ff9d, #ff00e6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    text-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
    animation: slideInDown 1s ease forwards;
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tag {
    background: linear-gradient(45deg, #00ff9d, #ff00e6);
    color: white;
    font-weight: 600;
    padding: 0.6rem 1.2rem;
    border-radius: 0.6rem;
    font-size: 0.9rem;
    margin-right: 0.5rem;
    display: inline-block;
    box-shadow: 0 4px 10px rgba(0, 255, 157, 0.3);
    transition: all 0.3s ease;
  }

  .tag:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 255, 157, 0.5);
  }

  .description {
    font-size: 1.1rem;
    color: #b0b0b0;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .operation-wrapper {
    background: rgba(25, 25, 25, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
  }

  .operation-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 255, 157, 0.2);
  }

  .operation-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00ff9d, #ff00e6);
    opacity: 0;
    transition: 0.5s;
    z-index: -1;
  }

  .operation-wrapper:hover::after {
    opacity: 0.1;
  }

  .operation-wrapper .heading {
    background: linear-gradient(45deg, #00ff9d, #ff00e6);
    color: white;
    padding: 1.2rem;
    font-weight: 600;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .operation-wrapper .heading span {
    background: rgba(0, 0, 0, 0.4);
    padding: 0.6rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .operation-wrapper .heading span:hover {
    background: rgba(0, 0, 0, 0.6);
  }

  .operation-wrapper .content {
    padding: 1.8rem;
    background: #1a1a1a;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .response {
    background: rgba(20, 20, 20, 0.8);
    border-radius: 0.5rem;
    padding: 1.2rem;
    margin: 0.8rem 0;
    border-left: 4px solid #00ff9d;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
  }

  .response:hover {
    transform: scale(1.02);
    background: rgba(25, 25, 25, 0.9);
  }

  .response-code {
    font-weight: bold;
    color: #00ff9d;
    font-size: 1.1rem;
  }

  .schema-container {
    background: rgba(25, 25, 25, 0.8);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    font-family: monospace;
    overflow-x: auto;
    max-width: 100%;
    white-space: pre-wrap;
  }

  .schema-key {
    color: #00ff9d;
    font-weight: bold;
  }

  .schema-value {
    color: #e0e0e0;
  }

  .parameter-input {
    background: #2a2a2a;
    border: 1px solid #444;
    color: #ffffff;
    border-radius: 0.5rem;
    padding: 0.8rem 1rem;
    width: 100%;
    margin: 0.8rem 0;
    font-family: monospace;
    transition: all 0.3s ease;
  }

  .parameter-input:focus {
    outline: none;
    border-color: #00ff9d;
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
  }

  .try-out-button {
    background: linear-gradient(45deg, #00ff9d, #ff00e6);
    color: white;
    border: none;
    padding: 0.8rem 1.8rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    font-size: 1rem;
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.4);
    min-width: 180px;
    text-align: center;
  }

  .try-out-button:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(0, 255, 157, 0.6);
  }

  .try-out-button:active {
    transform: scale(0.98);
  }

  .operation-wrapper.active {
    border: 1px solid #00ff9d;
    animation: neonGlow 2s infinite alternate;
  }

  @keyframes neonGlow {
    from {
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    }
    to {
      box-shadow: 0 0 20px rgba(0, 255, 157, 0.8);
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
    }
    .operation-wrapper {
      margin-bottom: 1rem;
    }
    .tag {
      font-size: 0.8rem;
      padding: 0.5rem 1rem;
    }
    .description {
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 480px) {
    .main-container {
      margin-top: 1rem;
      padding: 0;
    }
    .content {
      padding: 1.5rem;
    }
    h1 {
      font-size: 2rem;
    }
    .try-out-button {
      min-width: 100%;
      margin-top: 1rem;
    }
  }

  .loading {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  .schema-container .schema-value {
    font-weight: normal;
    color: #c0c0c0;
  }
`;

const options = {
  customSiteTitle: config.options.webName,
  customfavIcon: config.options.favicon,
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
  ],
  customCssUrl: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
  ],
  customCss: `${theme.getBuffer(SwaggerThemeNameEnum.DARK)} ${customCss}`,
  swaggerOptions: {
    displayRequestDuration: true,
    defaultModelExpandDepth: 1,
    docExpansion: "list",
    showExtensions: true,
    tryItOutEnabled: true,
    operationsSorter: "alpha",
    tagsSorter: "alpha",
    filter: true,
    layout: "BaseLayout",
    jsonEditor: false,
    oauth2RedirectUrl: null,
  },
};

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: config.options.name,
    description: config.options.description,
    version: "1.0.0",
    "x-logo": {
      url: config.options.favicon,
      altText: config.options.name,
    },
  },
  servers: [
    {
      url: config.host.BASE_URL,
    },
  ],
  tags: [
    {
      name: "Tools",
      description:
        "API buat lo yang pengen ngulik berbagai tools kece, kayak speedtest, ping, dan lainnya.",
    },
    {
      name: "AI",
      description:
        "API buat layanan AI kece, termasuk Google Search AI sama Google Execute Code.",
    },
  ],
  paths: {
    "/api/tools/speedtest": {
      get: {
        tags: ["Tools"],
        summary: "Speed Test",
        description:
          "Tes kecepatan upload, ping ke Google, plus info lokasi jaringan lo.",
        responses: {
          200: {
            description: "Hasil speedtest keren berhasil didapetin",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                    result: {
                      type: "object",
                      properties: {
                        upload: { type: "string", example: "4.2 Mbps" },
                        ping: { type: "string", example: "89 ms" },
                        server: { type: "string", example: "Jakarta, Jakarta, ID" },
                        provider: {
                          type: "string",
                          example: "PT Telekomunikasi Indonesia",
                        },
                        duration: { type: "string", example: "5.3 sec" },
                        time: {
                          type: "string",
                          example: "01/04/2024 15:30:25",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Kesalahan server, coba ulang ya!",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Upload testnya timeout bro!",
                    },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ai/google-search": {
      get: {
        tags: ["AI"],
        summary: "Google Search AI",
        description:
          "Cari info pakai Google Gemini AI dengan fitur Google Search, cepet dan kekinian.",
        parameters: [
          {
            name: "query",
            in: "query",
            description:
              "Masukin pertanyaan atau kata kunci yang mau dicari di Google Search AI.",
            required: true,
            schema: {
              type: "string",
              example: "Siapa pemenang Euro 2024?",
            },
          },
        ],
        responses: {
          200: {
            description: "Hasil pencarian berhasil didapetin, sip!",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                    result: {
                      type: "string",
                      example: "Pemenang Euro 2024 adalah tim nasional Jerman.",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Parameter query gak diisi, bro!",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Bro, masukin parameter query dong!",
                    },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server lagi error pas panggil Google Search AI nih.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Google Search AI gagal merespon",
                    },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ai/google-execute": {
      get: {
        tags: ["AI"],
        summary: "Google Execute Code",
        description:
          "Eksekusi kode pakai Google Gemini AI, tinggal kasih perintah, beres deh.",
        parameters: [
          {
            name: "query",
            in: "query",
            description:
              "Isi dengan instruksi buat generate dan jalanin kode-nya ya.",
            required: true,
            schema: {
              type: "string",
              example:
                "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.",
            },
          },
        ],
        responses: {
          200: {
            description: "Kode berhasil dieksekusi, hasil siap cek!",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                    result: {
                      type: "string",
                      example:
                        "Penjelasan lengkap\nKode:\n...source code...\nHasil:\n...eksekusi output...",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Query-nya gak dikasih, isi dulu dong bro!",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Bro, masukin parameter query dong!",
                    },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error pas manggil Google Execute Code AI nih.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Google Execute Code AI gagal merespon",
                    },
                    developer: {
                      type: "string",
                      example: config.options.developer,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ai/google-maps": {
      get: {
        tags: ["AI"],
        summary: "Google Maps AI",
        description:
          "Bikin rencana jalan-jalan plus info lokal pakai context peta Google, lengkap banget.",
        parameters: [
          {
            name: "query",
            in: "query",
            description:
              "Permintaan yang mau diproses AI dengan konteks peta Google ya.",
            required: true,
            schema: {
              type: "string",
              example: "the best places to eat in Jakarta",
            },
          },
          {
            name: "location",
            in: "query",
            description:
              "Preset lokasi buat konteks peta, contohnya jakarta, new-york, dll.",
            required: false,
            schema: {
              type: "string",
              enum: [
                // Amerika Utara
                "san-francisco",
                "los-angeles",
                "new-york",
                "chicago",
                "houston",
                "toronto",
                "vancouver",
                "mexico-city",
                // Amerika Selatan
                "sao-paulo",
                "rio-de-janeiro",
                "buenos-aires",
                "lima",
                "bogota",
                // Eropa
                "london",
                "paris",
                "berlin",
                "madrid",
                "rome",
                "amsterdam",
                "moscow",
                "vienna",
                "zurich",
                "stockholm",
                // Asia
                "jakarta",
                "bandung",
                "surabaya",
                "bali",
                "yogyakarta",
                "medan",
                "makassar",
                "semarang",
                "singapore",
                "bangkok",
                "kuala-lumpur",
                "manila",
                "tokyo",
                "osaka",
                "seoul",
                "beijing",
                "shanghai",
                "hong-kong",
                "taipei",
                "hanoi",
                "delhi",
                "mumbai",
                "dubai",
                "riyadh",
                "istanbul",
                // Afrika
                "cairo",
                "nairobi",
                "lagos",
                "cape-town",
                "johannesburg",
                // Oseania
                "sydney",
                "melbourne",
                "brisbane",
                "perth",
                "auckland",
                "wellington",
                // Kepulauan tambahan
                "honolulu",
                "maldives",
                "fiji",
                "papua",
              ],
              example: "jakarta",
            },
          },
        ],
        responses: {
          200: {
            description:
              "Response AI dengan bumbu grounding Google Maps sukses didapetin.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    developer: { type: "string", example: config.options.developer },
                    result: {
                      type: "object",
                      properties: {
                        text: {
                          type: "string",
                          example: "Here is the plan for your trip to San Francisco...",
                        },
                        groundingMetadata: {
                          type: "object",
                          description:
                            "Metadata untuk tampilkan konteks peta plus sumbernya.",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Parameter query wajib diisi, bro!",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Parameter query wajib diisi.",
                    },
                    developer: { type: "string", example: config.options.developer },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error pas manggil Google Maps AI nih.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Google Maps AI gagal merespon",
                    },
                    developer: { type: "string", example: config.options.developer },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "x-request-time": new Date().toISOString(),
};

module.exports = { swaggerDocument, options };