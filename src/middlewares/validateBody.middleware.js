import asyncHandler from "../utils/asyncHandler";

export function validateBody(keys = []) {
    return asyncHandler(function(req, res, next) {
        if (!req.body || Object.keys(req.body).some((field) => !keys.includes(field))) {
            throw new ApiError(400, "Request body empty or does not contain required fields");
        }
        next()
    });
}