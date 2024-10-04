const crypto = require('crypto');
const {secretKey,ivKey} = require('../config/globals.js');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);  // AES-256 key (32 bytes)
const iv = crypto.randomBytes(16);   // AES IV (16 bytes)
const CustomEncrypt = function(){}


// Encrypt function
CustomEncrypt.encrypt = (text,req,res) =>{

    
    
    
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey,'hex'), Buffer.from(ivKey,'hex'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // console.log(encrypted.toString());
    res.status(200).send({"data":encrypted});
    
}

// Decrypt function
function decrypt(encryptedText, ivHex, keyHex) {
    const ivBuffer = Buffer.from(ivHex, 'hex');
    if (ivBuffer.length !== 16) {
        throw new Error('Invalid IV length: IV must be 16 bytes.');
    }
    const decipher = createDecipheriv(algorithm, Buffer.from(keyHex, 'hex'), ivBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = CustomEncrypt;

