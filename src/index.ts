import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.post('/shipment', async (_req: any, _res: any) => {
});

app.post('/organization', (_req: any, _res: any) => {
});

app.get('/shipments/:referenceId', (_req: any, _res: any) => {
});

app.get('/organizations/:id', (_req: any, _res: any) => {
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
