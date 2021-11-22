const { Category } = require('../models');

class CategoryController {
    static async getAll(req, res, next) {
        try {
            const foundCategory = await Category.findAll({
                attributes:{
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            res.status(200).json(foundCategory);    
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CategoryController;