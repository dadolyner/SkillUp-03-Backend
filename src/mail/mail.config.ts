// SendGrid Mail Config
import * as SendGrid from "@sendgrid/mail";

import * as dotenv from "dotenv";
dotenv.config();

const SendEmail = async (emailData: SendGrid.MailDataRequired) => {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    const transport = await SendGrid.send(emailData);

    return transport;
}

export default SendEmail;