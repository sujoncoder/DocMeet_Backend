import OpenAI from 'openai';
import { SECRET } from './env';


export const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: SECRET.OPENROUTER_API_KEY,
});