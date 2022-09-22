import { createTransport } from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

const TEST_MAIL = process.env.ADMIN_MAIL

const transporter = createTransport({
   service: 'gmail',
   port: 587,
   auth: {
       user: process.env.USER_MAIL,
       pass: process.env.PASS_MAIL,
   },
});

 async function sendNodeEmail(mailOptions) {
    try {
      const info = await transporter.sendMail(mailOptions)
      console.log(info)
   } catch (err) {
      console.log(err)
   }
  }

export default sendNodeEmail


// codigo to send

        /*
        const subjectMail = 'New Account Created !!!'
        const dataMail = `username: ${req.body.email}<br>
                        firstName: ${req.body.firstName}<br>
                        lastName: ${req.body.lastName}<br>`

        mailOptions.subject = `CH - Notification: ${subjectMail}`
        mailOptions.html = `<h1 style="color: blue;">Notificacion: <span style="color: green;">${subjectMail}<br>${dataMail}</span></h1>`
        sendNodeEmail(mailOptions)
*/