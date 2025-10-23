import Stripe from "stripe";
import { SECRET } from "../config/env";

export const stripe = new Stripe(SECRET.STRIPE_SECRET_KEY as string);