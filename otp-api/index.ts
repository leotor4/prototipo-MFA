import express, { Request, Response } from 'express';
import crypto from 'crypto';
import 'dotenv/config' 
const router = express.Router();

const app = express();
app.use(express.json());
app.use('/otp', router);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
const ALGORITHM = 'aes-256-ctr';

function encrypt(text: string) {
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.alloc(16, 0));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(text: string) {
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.alloc(16, 0));
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function generateOTP(secret: string, period = 30): string {
    const time = Math.floor(Date.now() / 1000 / period);
    const hmac = crypto.createHmac('sha1', secret);
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

router.post("/generate", (req: Request, res: Response) => {
    const { secret } = req.body;

    if(!secret) 
        return res.status(400).json();

    const parsedSecret = decrypt(secret as string);
    const otp = generateOTP(parsedSecret);
    const now = Math.floor(Date.now() / 1000);
    const validUntil = now + 30 - (now % 30);
    
    res.json({ otp: otp, expiresIn: validUntil });
});

router.post("/validate", (req: Request, res: Response) => {
    let { secret, otp } = req.body;

    if(!secret || !otp) 
        return res.status(400).json();
    otp = otp.toString();
    const parsedSecret = decrypt(secret as string);
    const validOTP = generateOTP(parsedSecret as string);
    if (otp === validOTP) {
        res.json({ validated: true });
    } else {
        res.json({ validated: false });
    }
});

app.listen(3000, () => {
    console.log("App rodando na porta 3000");
});