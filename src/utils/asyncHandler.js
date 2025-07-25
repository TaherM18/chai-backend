// Promise approach
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
                .catch((error) => next(error));
    }
}

export { asyncHandler }

// method approach
// const asyncHandler = (fn) => {
//     return async function(req, res, next) {
//         try {
//             await fn(req, res, next);
//         }
//         catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             });
//         }
//     }
// }