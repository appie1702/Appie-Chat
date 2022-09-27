const notfound = (req,res,next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500:res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        //basically settings.DEBUG in django
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });

}

module.exports = { notfound, errorHandler };