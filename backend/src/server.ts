import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import express from "express";
import { pruebaConexion } from "./config/conexion";
import apiRouter from "./routes/apiRouter";
import { errorHandler } from "./errors/errorHandler";
import { notFoundHandler } from "./utils/middleware/notFound.middleware";
import {
    JsonSyntaxError,
    validateEmptyBody,
} from "./utils/middleware/jsonValid.middleware";

dotenv.config();

const app = express();

// APP_PORT mantiene compatibilidad local. En Render/Railway normalmente se usa PORT.
const port = Number(process.env.APP_PORT ?? process.env.PORT ?? 3000);

const configuredOrigins = (
    process.env.ANGULAR_ORIGINS ??
    process.env.ANGULAR_PORT ??
    "http://localhost:4200"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // Permite herramientas sin Origin (Postman, health checks) y los frontends configurados.
        if (!origin || configuredOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origen CORS no permitido: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(JsonSyntaxError);
app.use(validateEmptyBody);
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "API disponible" });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
    await pruebaConexion();

    app.listen(port, "0.0.0.0", () => {
        console.log(`SERVIDOR EJECUTÁNDOSE EN PUERTO: ${port}`);
    });
}

start().catch((error) => {
    console.error("No se pudo iniciar el servidor", error);
    process.exit(1);
});
