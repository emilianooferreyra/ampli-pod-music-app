import { Resend } from "resend";
import {
  RESEND_API_KEY,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "@/utils/variables";
import { generateTemplate } from "@/mail/template";

const resend = new Resend(RESEND_API_KEY);

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { name, email } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  await resend.emails.send({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Welcome to Podify",
    html: generateTemplate({
      title: "Welcome to Podify",
      message: welcomeMessage,
      logo: "https://your-domain.com/logo.png", // Reemplazar con URL pública
      banner: "https://your-domain.com/welcome.png", // Reemplazar con URL pública
      link: "#",
      btnTitle: token,
    }),
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const { email, link } = options;

  const message =
    "We just received a request that you forgot your password. No problem you can use the link below and create brand new password.";

  await resend.emails.send({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Reset Password Link",
    html: generateTemplate({
      title: "Forget Password",
      message,
      logo: "https://your-domain.com/logo.png", // Reemplazar con URL pública
      banner: "https://your-domain.com/forget_password.png", // Reemplazar con URL pública
      link,
      btnTitle: "Reset Password",
    }),
  });
};

export const sendPassResetSuccessEmail = async (
  name: string,
  email: string
) => {
  const message = `Dear ${name} we just updated your new password. You can now sign in with your new password.`;

  await resend.emails.send({
    from: VERIFICATION_EMAIL,
    to: email,
    subject: "Password Reset Successfully",
    html: generateTemplate({
      title: "Password Reset Successfully",
      message,
      logo: "https://your-domain.com/logo.png", // Reemplazar con URL pública
      banner: "https://your-domain.com/forget_password.png", // Reemplazar con URL pública
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
  });
};
