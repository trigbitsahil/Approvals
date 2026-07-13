import CryptoJS from "crypto-js";

const SECRET_KEY = "3fac2995-3cc0-40f3-a8ff-ccac06fcb8fa7dff1614-4932-42a0-a706-4df39faa0c55";

export function encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

export function decryptToken(cipherText: string): string {
    if (!cipherText) return "";
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || "";
    } catch (error) {
        console.warn("Failed to decrypt token. Corrupted data or key mismatch.");
        return "";
    }
}