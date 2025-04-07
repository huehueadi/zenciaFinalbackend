import cluster from "cluster";
import cors from 'cors';
import os from "os";
import app from "./app.js";

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));

if (cluster.isPrimary) {

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
 
  app.listen(PORT, () => {
    console.log("server Started")
  });
}