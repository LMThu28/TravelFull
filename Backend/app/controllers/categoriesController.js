const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const categoriesController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await db('categories').select('*');
            res.status(200).json(createResponse(true, categories, 'Categories retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving categories'));
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const category = await db('categories').where('id', req.params.id).first();
            if (!category) {
                return res.status(404).json(createResponse(false, null, 'Category not found'));
            }
            res.status(200).json(createResponse(true, category, 'Category retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving category'));
        }
    },

    createCategory: async (req, res) => {
        try {
            const [id] = await db('categories').insert(req.body);
            const newCategory = await db('categories').where('id', id).first();
            res.status(201).json(createResponse(true, newCategory, 'Category created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating category'));
        }
    },

    updateCategory: async (req, res) => {
        try {
            await db('categories').where('id', req.params.id).update(req.body);
            const updatedCategory = await db('categories').where('id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedCategory, 'Category updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating category'));
        }
    },

    deleteCategory: async (req, res) => {
        try {
            await db('categories').where('id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'Category deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting category'));
        }
    },

    searchCategories: async (req, res) => {
        const { query } = req.query;
        try {
            const categories = await db('categories').where('name', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, categories, 'Categories searched successfully'));
        } catch (error) {
            console.error('Error searching categories:', error);
            res.status(500).json(createResponse(false, null, 'Error searching categories'));
        }
    },
};

module.exports = categoriesController;
