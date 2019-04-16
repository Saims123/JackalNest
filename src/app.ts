import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import errorMiddleWare from './exceptions/error-middleware';
class App {
  public app: express.Application;
  public port: number;

  constructor(controllers, port) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initiateErrorHandling();
    this.initiateCORS();
    this.initializeControllers(controllers);
    this.connectToMongoDB();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(loggerMiddleware);
  }

  private initiateErrorHandling() {
    this.app.use(errorMiddleWare);
  }
  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router);
    });
  }

  private initiateCORS() {
    this.app.use(cors());
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`JackaNest listening on the port ${this.port}`);
    });
  }
  //         'mongodb+srv://jackal:Jackaltrackbase@jackalcluster0-1stlt.mongodb.net/JackalBase',

  public connectToMongoDB() {
    mongoose
      .connect(
        'mongodb+srv://jackal:Jackaltrackbase@jackalcluster0-1stlt.mongodb.net/JackalBase',

        {
          useNewUrlParser: true
        }
      )
      .then(
        () => {
          console.log('SUCCESSFULLY CONNECT TO MONGO-ATLAS');
        },
        err => {
          console.error(err, 'Failed to connect to MongoDB-ATLAS');
        }
      );
  }
}

function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next
) {
  console.log(`${request.method} ${request.path}`);
  next();
}

export default App;
