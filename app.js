import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async ()=>{
    await connectDB(process.env.MONGO_DB_URI);
    const app = Fastify();

    app.register(fastifySocketIO, {
        cors: {
          origin: "*",
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ["websocket"],
      });


    await registerRoutes(app);

    await buildAdminRouter(app);

    app.listen({port:PORT},
        (err, addr)=> {
            if(err) {
                console.log(err)
            }
            else {
                console.log(`server is started at http://localhost:${PORT}${admin.options.rootPath}`);
            }
        }
    )

    app.ready().then(() => {
        app.io.on("connection", (socket) => {
          console.log("A User Connected ✔");
      
          socket.on("joinRoom", (orderId) => {
            socket.join(orderId);
            console.log(`User Joined room ${orderId}`);
          });
      
          socket.on("disconnect", () => {
            console.log("User Disconnected X");
          });
        });
      });
}
start();