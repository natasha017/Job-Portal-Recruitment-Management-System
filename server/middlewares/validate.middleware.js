const validate = (schema, source = "body") => async (req, res, next) => {
    try {
        const parsedData = await schema.parseAsync(req[source]);

        req[source] = parsedData;

        next();

    } catch (err) {

        if (err.name === "ZodError") {
            const error = {
                status: 400,
                message: "Validation failed",
                extraDetails: err.issues.map(issue => issue.message)
            };

            return next(error);
        }

        next(err);
    }
};

export default validate;