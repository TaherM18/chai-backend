import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async function(req, res) {

    console.log(`Request Body:\n${JSON.stringify(req.body)}`);
    console.log(`Request Flies:\n${JSON.stringify(req.files)}`);

    const { username, email, fullname, password } = req.body;

    if ( [username, email, fullname, password].some((field) => field?.trim() === "") ) {
        throw new ApiError(400, "All field are required");
    }

    const existingUser = User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar image");
    }

    const createdUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        refreshToken: ""
    });

    const foundUser = User.findById(createdUser._id).select("-password -refreshToken");

    if (!foundUser) {
        throw new ApiError(500, "Failed to create user");
    }

    res.status(201).json(
        new ApiResponse(201, foundUser, "User created successfully")
    );
});

export { registerUser };