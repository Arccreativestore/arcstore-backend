import nodemailer from 'nodemailer';
import {G_HOST, G_PORT, G_USER, G_PASSWORD} from './config'


const host = G_HOST as string
const port = Number(G_PORT)  // Default port for SMTP
const user = G_USER as string
const pass = G_PASSWORD as string

export const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // True for 465, false for other ports
    auth: {
        user,
        pass,
    },
});
