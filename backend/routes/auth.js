import express from 'express';

const router = express.Router();

router.post('/verify-pin', (req, res) => {
    const { passcode } = req.body;

    if (!passcode) {
        return res.status(400).json({ success: false, message: 'Passcode is required' });
    }

    const correctPin = process.env.PASSCODE || process.env.APP_PIN;

    if (passcode === correctPin) {
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('shop_auth', 'verified', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({ success: true, message: 'Authenticated' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid passcode' });
    }
});

router.post('/logout', (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('shop_auth', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax'
    });
    res.status(200).json({ success: true, message: 'Logged out' });
});

router.get('/check', (req, res) => {
    if (req.cookies.shop_auth === 'verified') {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

export default router;
