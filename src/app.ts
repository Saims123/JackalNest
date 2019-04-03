import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
 
class App {
  public app: express.Application;
  public port: number;
 
  constructor(controllers, port) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToMongoDB();
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(loggerMiddleware);
  }
 
  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`JackaNest listening on the port ${this.port}`);
    }); 
  }

  public connectToMongoDB() {
    mongoose.connect('mongodb://localhost:27017/JackalTrack', { useNewUrlParser: true });
      console.log('SUCCESSFULLY CONNECT TO DATABASE')

  }
}

function loggerMiddleware(request: express.Request, response: express.Response, next) {
  console.log(`${request.method} ${request.path}`);
  next();
}
 
export default App;