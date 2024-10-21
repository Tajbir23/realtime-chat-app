import forge from 'node-forge';
const encryptMessage = (message: string, publicKeyPem: string) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
        md: forge.md.sha256.create(), // Message digest
    });
    return forge.util.encode64(encrypted);
}
export default encryptMessage