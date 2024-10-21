import forge from "node-forge"
import CryptoJS from "crypto-js"
const GenerateSecretKey = () => {
    const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048)
    const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
//   const publicKeyRaw = publicKeyPem
//   .replace('-----BEGIN PUBLIC KEY-----\n', '')
//   .replace('-----END PUBLIC KEY-----', '')
//   .replace(/\n/g, ''); // Remove line breaks for cleaner output

// const privateKeyRaw = privateKeyPem
//   .replace('-----BEGIN RSA PRIVATE KEY-----\n', '')
//   .replace('-----END RSA PRIVATE KEY-----', '')
//   .replace(/\n/g, '');

const encryptPrivateKey = CryptoJS.AES.encrypt(privateKeyPem, `${import.meta.env.VITE_ENCRYPT_SECRET_KEY}`).toString();

return { publicKey, privateKey, publicKeyPem, encryptPrivateKey };
}
export default GenerateSecretKey