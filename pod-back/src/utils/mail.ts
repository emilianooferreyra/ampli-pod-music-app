import path from "node:path";
import nodemailer from "nodemailer";
import {
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  MAILTRAP_PASS,
} from "@/utils/variables";
import { renderEmailTemplate } from "@/mail/template";

const transport = nodemailer.createTransport({
  host: MAILTRAP_HOST,
  port: parseInt(MAILTRAP_PORT),
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});

interface Profile {
  name: string;
  email: string;
  userId: string;
}

interface Options {
  email: string;
  link: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { name, email } = profile;

  const welcomeMessage = `Hi ${name}, welcome to IntuneApp! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  await transport.sendMail({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Welcome to Intune",
    html: renderEmailTemplate({
      title: "Welcome to Intune",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

export const sendForgetPasswordLink = async (options: Options) => {
  const { email, link } = options;

  const message =
    "We just received a request that you forgot your password. No problem you can use the link below and create brand new password.";

  await transport.sendMail({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Reset Password Link",
    html: renderEmailTemplate({
      title: "Forget Password",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

export const sendPassResetSuccessEmail = async (
  name: string,
  email: string
) => {
  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password.`;

  await transport.sendMail({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Password Reset Successfully",
    html: renderEmailTemplate({
      title: "Password Reset Successfully",
      message,
      logo: "https://your-domain.com/logo.png", // Reemplazar con URL pública
      banner: "https://your-domain.com/forget_password.png", // Reemplazar con URL pública
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
  });
};
