class ApiError extends Error {
    constructor(
        statusCode = 500,
        message = "Something went wrong",
        errors = [],
        stackTrace = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stackTrace) {
            this.stackTrace = stackTrace;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;