import 'dotenv/config';
import express from 'express';
import { ROUTES } from './constants/index.js';
import getAuthenticatedApps from './utils/init.js';

const app = express();

// middlewares



app.use(express.json());


app.get('/server-health', (req, res) => res.send(process.env.SERVER_HEALTHY_MESSAGE || 'ok'));


app.get(ROUTES.requests, (req, res))
