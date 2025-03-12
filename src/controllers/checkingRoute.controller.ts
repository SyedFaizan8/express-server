import { Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index";

export const checkingRoute = asyncHandler(async (req: Request, res: Response) => {

    try {
        const params = req.query;
        if (!params) throw new ApiError(411, "Incorrect inputs")

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { hello: params },
                    "Hello from server",
                ),
            );
    } catch (error) {
        throw new ApiError(500, "Internal server error while helloing");
    }
});
