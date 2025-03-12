import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  prisma,
  ApiError,
  asyncHandler,
  ACCESS_SECRET,
  REFRESH_SECRET,
  generateAccessAndRefereshTokens,
  accessTokenOptions,
  refreshTokenOptions
} from "../utils/index";

export interface AuthRequest extends Request {
  user?: { user_id: string };
}

const getTokenFromRequest = (req: AuthRequest): string | undefined => {
  return req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
};

const getRefreshTokenFromRequest = (req: AuthRequest): string | undefined => {
  return req.cookies?.refreshToken || req.body.refreshToken;
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new ApiError(401, "Unauthorized Request");
  }
};

const findUserById = async (user_id: string) => {
  const user = await prisma.user.findUnique({
    where: { user_id },
    select: { user_id: true, refreshToken: true },
  });
  if (!user) throw new ApiError(401, "User not found");
  return user;
};

export const verifyJWT = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req);
    if (!token) throw new ApiError(401, "Unauthorized Request");

    let decodedToken: JwtPayload;
    try {
      decodedToken = verifyToken(token, ACCESS_SECRET);
    } catch {
      const refreshToken = getRefreshTokenFromRequest(req);
      if (!refreshToken) throw new ApiError(401, "Unauthorized Request");

      const decodedRefreshToken = verifyToken(refreshToken, REFRESH_SECRET);
      const user = await findUserById(decodedRefreshToken.user_id);

      if (refreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

      const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user.user_id);

      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

      req.user = { user_id: user.user_id };
      return next();
    }

    const user = await findUserById(decodedToken.user_id);
    req.user = { user_id: user.user_id };

    next();
  }
);
