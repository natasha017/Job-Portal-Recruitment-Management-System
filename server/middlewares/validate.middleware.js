const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);

        req.body = parseBody;

        next();

    } catch (err) {

        if (err.name === "ZodError") {
            const error = {
                status: 400,
                message: "Validation failed",
                extraDetails: err.issues.map((issue) => issue.message)
            };

            return next(error);
        }

        next(err);
    }
};

export default validate;
