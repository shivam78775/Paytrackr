import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
    const { passcode } = req.body;
    
    if (!passcode) {
        return res.status(400).json({ success: false, message: 'Passcode is required' });
    }

    if (passcode === process.env.PASSCODE) {
        // Set HTTP-only cookie for authentication
        res.cookie('auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({ success: true, message: 'Authenticated' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid passcode' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('auth');
    res.status(200).json({ success: true, message: 'Logged out' });
});

router.get('/check', (req, res) => {
    if (req.cookies.auth === 'true') {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

export default router;
