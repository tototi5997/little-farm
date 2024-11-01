import CryptoJS from "crypto-js";

const SECRET_KEY = "1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9";

/**
 * Encrypt data
 * @param data
 * @returns
 */
export const encrypt = (data: unknown) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encrypt error:", error);
  }
};

/**
 *
 * @param ciphertext
 * @returns
 */
export const decrypt = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedData) {
      return JSON.parse(decryptedData);
    }
  } catch (error) {
    console.error("Decrypt error:", error);
  }
};
