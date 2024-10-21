import forge from 'node-forge';
import CryptoJS from 'crypto-js';
const pemToPrivateKey = (chatId: string) => {
    const encryptedPrivateKey = sessionStorage.getItem(`${chatId}`)
    const bytes = CryptoJS.AES.decrypt(`${encryptedPrivateKey}`, `${import.meta.env.VITE_ENCRYPT_SECRET_KEY}`);
    const privateKeyPem = bytes.toString(CryptoJS.enc.Utf8);
    return forge.pki.privateKeyFromPem(privateKeyPem);
};

export default pemToPrivateKey;