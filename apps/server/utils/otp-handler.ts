/**
 * The OTP Service will be later on re-designed to handle OTPs via a Redis server
 */
import transporter from "./mailTransporter";
import { VERIFY_OTP, WELCOME_EMAIL } from "./templateMap";

const OTP_MAP: { [key: string]: any } = {}; // { email: { otp: '123456', expiresAt: 168383838383 } }

export function generateOTP(email: string) {
  Object.keys(OTP_MAP).forEach((key) => {
    if (OTP_MAP[key].expiresAt < Date.now()) {
      delete OTP_MAP[key];
    }
  });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  OTP_MAP[email] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // expires in 10 minutes
  };
  return OTP_MAP[email];
}

// add a template to the email
export async function handleSendMail(email: string, templateId: string) {
  const { otp } = generateOTP(email);

  let template = "";
  if (templateId === "welcome") {
    template = WELCOME_EMAIL.replace("{VERIFICATION_LINK}", "");
  } else if (templateId === "email-otp-verification") {
    template = VERIFY_OTP.replace("{OTP}", otp);
  } else {
    template = VERIFY_OTP.replace("{OTP}", otp);
  }

  await transporter.sendMail({
    from: `"Auth Module" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification OTP",
    html: template,
  });
  return true;
}

export function handleVerifyOTP(email: string, otp: string) {
  if (!OTP_MAP[email]) throw new Error("OTP isn't present");

  if (OTP_MAP[email].expiresAt < Date.now())
    throw new Error("OTP expired, Request a new OTP!");

  if (OTP_MAP[email].otp != otp) {
    throw new Error("Incorrect OTP");
  }

  return true;
}
