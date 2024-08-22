import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
       
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decoded.id;
        next();
    });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
    
}