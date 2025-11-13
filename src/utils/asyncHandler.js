// Promise approach
export default function asyncHandler(requestHandler) {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
                .catch((error) => next(error));
    }
}

// method approach
// const asyncHandler = (fn) => {
//     return async function(req, res, next) {
//         try {
//             await fn(req, res, next);
//         }
//         catch (error) {
//             next(error)
//         }
//     }
// }