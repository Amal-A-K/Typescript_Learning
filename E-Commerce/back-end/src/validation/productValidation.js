import validator from 'validator';

export const validateProduct = (req, res, next) => {
    const errors = {};
    const { name, price, description, category, stock } = req.body;

    if (!name || validator.isEmpty(name)) {
        errors.name = 'Product name is required';
    }

    if (!price || isNaN(price) || price < 0) {
        errors.price = 'Valid price is required';
    }

    if(!description || validator.isEmpty(description)) {
        errors.description = 'Product description is required';
    }

    if(!category || validator.isEmpty(category)) {
        errors.category = 'Product category is required';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};