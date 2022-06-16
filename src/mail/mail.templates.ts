// Verify email template
export const VerifyEmailTemplate = (first_name: string, last_name: string, verifyLink: string) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password</title>
        </head>
        <body>
            <table>
                <tr>
                    <td>
                        <img src='https://i.postimg.cc/y8Y6Spbm/NextUp.png' border='0' alt='NextUp-Logo' width='20px' height='20px'/>
                        <span style="color: #2F3C7E; font-size: 20px;">NextUp</span>
                    </td>
                </tr>

                <tr><td><h3 style="font-size: 16px;"><span style="font-weight: 200;">Dear </span>${first_name} ${last_name}<span style="font-weight: 200;">,</span></h3></td></tr>
                
                <tr><p style="margin:0;">You are almost done.</p></tr>
                
                <tr><p style="margin:0;">To complete your registration please click on the link below to verify yout email.</p></tr>
                
                <tr><td>&nbsp;</td></tr>
                
                <tr><a style="color: #2F3C7E;" href="${verifyLink}">Verify Email</a></tr>
                
                <tr><td>&nbsp;</td></tr>
                
                <tr><p style="margin:0;">Best regards,</p></tr>
               
                <tr><span style="color: #2F3C7E; font-size: 16px;">NextUp</span></tr>
            </table>
        </body>
        </html>
    `;
}

// User added event template
export const CheckoutEventTemplate = (first_name: string, last_name: string, date: string, time: string, checkoutLink: string, userCreated: boolean) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password</title>
        </head>
        <body>
            <table>
                <tr>
                    <td>
                        <img src='https://i.postimg.cc/y8Y6Spbm/NextUp.png' border='0' alt='NextUp-Logo' width='20px' height='20px'/>
                        <span style="color: #2F3C7E; font-size: 20px;">NextUp</span>
                    </td>
                </tr>

                <tr><td><h3 style="font-size: 16px;"><span style="font-weight: 200;">Hey </span>${first_name} ${last_name}<span style="font-weight: 200;">,</span></h3></td></tr>

                ${ userCreated ? `
                    <tr><p style="margin:0;">You have successfully created a new event.</p></tr>
                ` : `
                    <tr><p style="margin:0;">An artist just added a new event that will be happening on <b>${date}</b> at <b>${time}</b></p></tr>
                ` }

                ${ userCreated ? `
                    <tr><p style="margin:0;">To checkout details of your event click the link below.</p></tr>
                ` : `
                    <tr><p style="margin:0;">To checkout this event and secure your spot click the link below and attend this event.</p></tr>
                ` }

                <tr><td>&nbsp;</td></tr>

                <tr><a style="color: #2F3C7E;" href="${checkoutLink}">Checkout Event</a></tr>

                <tr><td>&nbsp;</td></tr>

                <tr><p style="margin:0;">Best regards,</p></tr>

                <tr><span style="color: #2F3C7E; font-size: 16px;">NextUp</span></tr>
            </table>
        </body>
        </html>
    `;
}