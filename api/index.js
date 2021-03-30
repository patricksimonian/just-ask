import 'dotenv/config';
import express from 'express';
import logNode from "log-node";
import { ROUTES } from './constants/index.js';
import init from './utils/init.js';



async function initailize() {
  logNode();
  await init();
  const app = express();

// middlewares

  app.use(express.json());


  app.get('/server-health', (req, res) => res.send(process.env.SERVER_HEALTHY_MESSAGE || 'ok'));
}

initailize();




