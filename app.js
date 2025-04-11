import cors from 'cors';
import express from "express";
import path from 'path';
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

const __dirname = path.dirname(new URL(import.meta.url).pathname);




app.use('/api', registerrouter)

app.use('/api/hardware', hardwarerouter)

app.use('/api/license', trailrouter)

app.use('/api/gateway', paymentrouter)

app.use('/api/support', ticketRouter)

app.get('/', (req, res) => {
  res.send("HI");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app;