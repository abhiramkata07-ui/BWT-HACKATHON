export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace with parsed/sanitized data if schema defines it
    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map(
        (err) => `${err.path.join('.') || 'field'}: ${err.message}`
      );
      return res.status(400).json({
        success: false,
        message: 'Input validation failed',
        errors: formattedErrors,
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Invalid request payload',
      errors: [error.message],
    });
  }
};
