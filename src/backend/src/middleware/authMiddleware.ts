import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/tokenService";
import logger from "../utils/logger";

// ============================================
// JWT Authentication Middleware
// ============================================
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Check if it's a Bearer token
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid authorization header format. Expected: Bearer <token>" });
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach userId to request object
    (req as any).userId = decoded.userId;

    // Log authenticated request
    logger.info(`Authenticated request from user: ${decoded.userId}`);

    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
}

// ============================================
// Optional: Admin Middleware
// ============================================
export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  // This is a placeholder. In production, you would check if the user has admin role
  const userId = (req as any).userId;
  
  // TODO: Check user role from database
  // For now, just pass through
  
  next();
}
