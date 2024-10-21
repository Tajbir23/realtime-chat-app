import CryptoJS from "crypto-js";
import forge from 'node-forge';
const decryptMessage = (encryptedMessage: string, chatId: string) => {
    const encryptedPrivateKey = sessionStorage.getItem(`${chatId}`)
    const bytes = CryptoJS.AES.decrypt(`${encryptedPrivateKey}`, `${import.meta.env.VITE_ENCRYPT_SECRET_KEY}`);
    const privateKeyPem = bytes.toString(CryptoJS.enc.Utf8);

    console.log(privateKeyPem)
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
    const decoded = forge.util.decode64(encryptedMessage)
    const decrypted = privateKey.decrypt(decoded, 'RSA-OAEP', {
        md: forge.md.sha256.create(), // Message digest
    });
    return decrypted.toString();
}

export default decryptMessage