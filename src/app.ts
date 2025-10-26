import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import cookieParser from 'cookie-parser'
import cron from 'node-cron';
import { router } from './app/routes';
import { handleStripeWebhookEvent } from './app/modules/payment/payment.controller';
import { cancelUnpaidAppointments } from './app/modules/appointment/appointment.service';


const app: Application = express();

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhookEvent
);
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


cron.schedule('* * * * *', () => {
    try {
        console.log("Node cron called at ", new Date())
        cancelUnpaidAppointments();
    } catch (err) {
        console.error(err);
    }
});

app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;