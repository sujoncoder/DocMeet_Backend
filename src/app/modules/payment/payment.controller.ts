import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { handleStripeWebhookEventService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../utils/stripe";
import { SECRET } from "../../config/env";


// HANDLE STRIPE WEB HOOK EVENT CONTROLLER
export const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = SECRET.WEB_HOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await handleStripeWebhookEventService(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook req send successfully',
        data: result,
    });
});