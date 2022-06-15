import * as SendGrid from "@sendgrid/mail";

import * as dotenv from "dotenv";
import { EmailParamsDto } from "./dto/emailData.dto";
import VerifyEmailTemplate from "./mail.template";
dotenv.config();

const SendEmail = async (data: EmailParamsDto) => {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    
    const { first_name, last_name, email, token } = data;
    const emailData: SendGrid.MailDataRequired = {
        to: email,
        from: 'skulj.david@gmail.com',
        subject: 'Verify your email',
        html: VerifyEmailTemplate(first_name, last_name, `${process.env.VERIFY_EMAIL}/${token}`),
    }

    const transport = await SendGrid.send(emailData);

    return transport;
}

export default SendEmail;