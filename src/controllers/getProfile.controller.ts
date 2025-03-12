import { prisma, ApiError, ApiResponse, asyncHandler } from "../utils/index";

export const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) throw new ApiError(404, "User is not found");

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        imageId: true,
        fullname: true,
        username: true,
        email: true,
        bio: true,
        website: true,
      },
    });
    if (!user)
      throw new ApiError(404, "User not found while fetching for profile");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile found successfull"));
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Something went wrong while fetching profile");
  }
});
