import cors from 'cors';
import os from "os";
import app from "./app.js";
import execute from './src/config/db.config.js';
import connectionDatabase from './src/config/db.connect.js';
import connectToDB from './src/config/db.key.connect.js';

const numCPUs = os.cpus().length;
const PORT = 3000;

app.use(cors({
  origin: '*'
}));
connectionDatabase()
connectToDB()
execute()


// if (cluster.isPrimary) {

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
 
  app.listen(PORT, () => {
    console.log("server Started")
  });
