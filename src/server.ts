import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();

function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next
) {
  console.warn(`${request.method} ${request.path}`);

  console.log(`${request.method} ${request.path}`);
  next();
}

app.use(loggerMiddleware);
 
app.get('/test', (request, response) => {
  response.send('Hello world!');
});

app.use(bodyParser.json());

app.post('/', (request, response) => {
  response.send(request.body);
});

 
app.listen(5000);