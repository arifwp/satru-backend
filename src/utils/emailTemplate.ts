export const changeEmailTemplateMessage = (
  name: string,
  otpCode: number,
  formattedDate: string
) => `
  <div>
    <h1>Haii, ${name}!</h1>
    <p>Masukkan kode otp dibawah ini untuk mengganti email anda!</p>
    <p>${otpCode}</p>
    <p>Kode anda akan expired dalam ${formattedDate}</p>
  </div>
`;

export const resetPasswordEmail = (name: string, resetLink: string) => `
  <div>
    <h1>Hello, ${name}</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
  </div>
`;
