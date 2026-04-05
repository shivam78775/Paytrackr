export const requireAuth = (req, res, next) => {
    if (req.cookies.shop_auth === 'verified') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
};
