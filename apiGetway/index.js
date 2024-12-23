import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by");

const services = [
  { route: "/user", target: "http://localhost:3002/user" },
  { route: "/order", target: "http://localhost:3000/order" },
  { route: "/product", target: "http://localhost:3001/product" },
];

const rateLimit = 20;
const interval = 60 * 1000;
const requestCounts = {};

// Reset request counts periodically
setInterval(
  () => Object.keys(requestCounts).forEach((ip) => (requestCounts[ip] = 0)),
  interval
);

function rateLimitAndTimeout(req, res, next) {
  const ip = req.ip;
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > rateLimit) {
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  req.setTimeout(15000, () =>
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    })
  );

  next();
}

// Set up proxy middleware
services.forEach(({ route, target }) => {
  app.use(
    route,
    (req, res, next) => {
      console.log(`Proxying request to: ${target}${req.url}`);
      next();
    },
    rateLimitAndTimeout,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "" },
      onProxyRes(proxyRes, req) {
        console.log(`Proxied ${req.method} ${req.url} -> ${target}`);
      },
    })
  );
});

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "API Gateway running successfully",
  })
);

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`API Gateway is running on http://localhost:${PORT}`)
);
