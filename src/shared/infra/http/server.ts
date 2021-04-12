import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { errors } from 'celebrate';
import cors from 'cors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/appError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import rateLimiter from './middleware/rateLimiter';

const app = express();
app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        thing: 'AppError',
      });
    }

    return response.status(500).json({
      status: 'error',
      message: err.message,
      thing: 'ponlyerror',
    });
  },
);

app.listen(3333, () => {
  console.log('working on 3333');
});
