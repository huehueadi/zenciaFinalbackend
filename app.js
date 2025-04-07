import cors from 'cors';
import express from "express";
import hardwarerouter from './src/routes/harder.routes.js';
import paymentrouter from './src/routes/payment.routes.js';
import registerrouter from "./src/routes/register.routes.js";
import ticketRouter from './src/routes/ticket.routes.js';
import trailrouter from './src/routes/trailLicense.routes.js';
const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.use('/api', registerrouter)

app.use('/api/hardware', hardwarerouter)

app.use('/api/license', trailrouter)

app.use('/api/gateway', paymentrouter)

app.use('/api/support', ticketRouter)


app.use((err, req, res, next) => {
  res.status(500).json({ error: { code: "E500", message: "Internal Server Error" } });
});

export default app;