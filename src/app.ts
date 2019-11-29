import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import Controller from './routes/interfaces/controller.interface';
import errorMiddleware from './routes/middleware/error.middleware';
import * as https from 'https';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet'

const defaultLimiter = rateLimit({
    windowMs : 1*60*1000, 
    max : 1000
})


const loginLimiter = rateLimit({
    windowMs : 15*60*1000, 
    max : 10
})

class App {
    public app: express.Application;
    public port: number;
    public server;
    constructor(controllers) {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(fileUpload());
        this.app.use(defaultLimiter)
        this.app.use(helmet())
        this.app.use(cors())
        this.app.use("/auth",loginLimiter)
        this.app.use("/", controllers[0].router);
        this.app.use("/", controllers[1].router);
        this.app.use("/", controllers[2].router);
        this.app.use("/", controllers[3].router);
        this.app.use("/", controllers[4].router);
        this.app.use("/", controllers[5].router);
        this.app.use("/", controllers[6].router);
        this.app.use("/", controllers[7].router);
        this.app.use("/", controllers[8].router);
        this.app.use("/", controllers[9].router);
        this.app.use("/", controllers[10].router);
        this.app.use("/", controllers[11].router);
        this.app.use("/", controllers[12].router);
        this.app.use("/", controllers[13].router);
        this.app.use("/", controllers[14].router);
        this.app.use("/", controllers[15].router);
        this.app.use("/", controllers[16].router);
        this.app.use("/", controllers[17].router);
        this.app.use("/", controllers[18].router);
        this.initializeErrorHandling();
        // this.listen()
    }

    public getServer() {
        return this.app;
    }

    public closeServer = async () =>{
        await this.server.close()
        console.log("CLOSED")
    }

    private initializeMiddleware() {
        this.app.use(bodyParser)
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        let i = 0;
    }

    public listen = async () => {

        let opts = {
            key: fs.readFileSync(process.env.CRYPTOKEY),
            cert: fs.readFileSync(process.env.CRYPTOCERT)
        };
        this.server = https.createServer(opts, this.app);
        
        //await this.app.listen(process.env.PORT)
        await this.server.listen(process.env.PORT);
        console.log(`App listening on the port ${process.env.PORT}`);
    }
}

export default App;
