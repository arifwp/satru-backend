import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
});

client.on("qr-code", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("whatsapp service now ready");
});

client.initialize();

const validatePhoneNumber = (number: string): boolean => {
  const phoneRegex = /^[0-9]{1,15}$/;
  return phoneRegex.test(number);
};

export const sendWhatsappMessage = (number: string, msg: string) => {
  return new Promise((resolve, reject) => {
    if (!validatePhoneNumber(number)) {
      return reject(new Error("Format nomor harus diawali dengan +62"));
    }

    const chatId = `${number}@c.us`;
    client
      .sendMessage(chatId, msg)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
