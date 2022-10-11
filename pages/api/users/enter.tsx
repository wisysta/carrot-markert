import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/widthHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;

    const user = phone ? { phone: phone } : { email };
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous Name",
                        ...user,
                    },
                },
            },
        },
    });

    if (phone) {
        // const message = await twilioClient.messages.create({
        //   messagingServiceSid: process.env.TWILIO_MID,
        //   to: process.env.PHONE_NUMBER!,
        //   body: `Your login token is ${payload}`,
        // });
    } else if (email) {
        // const email = await mail.send({
        //   from: process.env.EMAIL_FROM!,
        //   to: process.env.EMAIL_TO,
        //   subject: "Your carrot market verification",
        //   text: `Your token is ${payload}`,
        // });
    }

    return res.json({ ok: true });
}

export default withHandler({ method: "POST", handler });
