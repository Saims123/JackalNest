import * as express from 'express';
class InitiateController {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.get(`${this.path}`, this.onInit)
  }

  onInit = async (
    request: express.Request,
    response: express.Response
  ) => {
    response.status(200).send("Successfully connected to JackalNest");
  }
}

export default InitiateController;