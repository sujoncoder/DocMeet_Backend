import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cokkieParser from "cookie-parser"
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import { router } from './app/routes';
import { handleStripeWebhookEvent } from './app/modules/payment/payment.controller';


const app: Application = express();

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhookEvent
);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// APPLICATION LEVEL MIDDLEWARE
app.use(express.json());
app.use(cokkieParser());
app.use(express.urlencoded({ extended: true }));

// ROUTE
app.use("/api/v1", router);

// ROOT ROUTE
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});


// CATCH MIDDLEWARE
app.use(globalErrorHandler);
app.use(notFound);

export default app;