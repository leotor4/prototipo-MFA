"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
require("dotenv/config");
const router = express_1.default.Router();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/otp', router);
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-ctr';
function encrypt(text) {
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.alloc(16, 0));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decrypt(text) {
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.alloc(16, 0));
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function generateOTP(secret, period = 30) {
    const time = Math.floor(Date.now() / 1000 / period);
    const hmac = crypto_1.default.createHmac('sha1', secret);
    hmac.update(Buffer.from(time.toString()));
    const hmacResult = hmac.digest();
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const binaryCode = (hmacResult[offset] & 0x7f) << 24
        | (hmacResult[offset + 1] & 0xff) << 16
        | (hmacResult[offset + 2] & 0xff) << 8
        | (hmacResult[offset + 3] & 0xff);
    const otp = binaryCode % (10 ** 6);
    return otp.toString().padStart(6, '0');
}
router.post("/generate", (req, res) => {
    const { secret } = req.body;
    if (!secret)
        return res.status(400).json();
    const parsedSecret = decrypt(secret);
    console.log(parsedSecret);
    const otp = generateOTP(parsedSecret);
    const now = Math.floor(Date.now() / 1000); // Get the current time in seconds
    const validUntil = now + 30 - (now % 30); // Get the time of the next 30-second interval
    res.json({ otp: otp, expiresIn: validUntil });
});
router.post("/validate", (req, res) => {
    let { secret, otp } = req.body;
    if (!secret || !otp)
        return res.status(400).json();
    otp = otp.toString();
    const parsedSecret = decrypt(secret);
    console.log(parsedSecret);
    const validOTP = generateOTP(parsedSecret);
    if (otp === validOTP) {
        res.json({ validated: true });
    }
    else {
        res.json({ validated: false });
    }
});
app.listen(3000, () => {
    console.log("App rodando na porta 3000");
});
