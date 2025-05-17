const db = require('../config/db');
const { createResponse } = require('../helpers/utils');

const newsController = {
    getAllNews: async (req, res) => {
        try {
            const news = await db('news').select('*');
            res.status(200).json(createResponse(true, news, 'News retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving news'));
        }
    },

    getNewsById: async (req, res) => {
        try {
            const news = await db('news').where('id', req.params.id).first();
            if (!news) {
                return res.status(404).json(createResponse(false, null, 'News not found'));
            }
            res.status(200).json(createResponse(true, news, 'News retrieved successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving news'));
        }
    },

    createNews: async (req, res) => {
        try {
            const [id] = await db('news').insert(req.body);
            const newNews = await db('news').where('id', id).first();
            res.status(201).json(createResponse(true, newNews, 'News created successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error creating news'));
        }
    },

    updateNews: async (req, res) => {
        try {
            await db('news').where('id', req.params.id).update(req.body);
            const updatedNews = await db('news').where('id', req.params.id).first();
            res.status(200).json(createResponse(true, updatedNews, 'News updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating news'));
        }
    },

    deleteNews: async (req, res) => {
        try {
            await db('news').where('id', req.params.id).del();
            res.status(200).json(createResponse(true, null, 'News deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting news'));
        }
    },

    searchNews: async (req, res) => {
        const { query } = req.query;
        try {
            const news = await db('news')
                .where('name', 'like', `%${query}%`);
            res.status(200).json(createResponse(true, news, 'News searched successfully'));
        } catch (error) {
            console.error('Error searching news:', error);
            res.status(500).json(createResponse(false, null, 'Error searching news'));
        }
    },

    updateNewsById: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedRows = await db('news').where('id', id).update(req.body);
            if (updatedRows === 0) {
                return res.status(404).json(createResponse(false, null, 'News item not found'));
            }
            const updatedNewsItem = await db('news').where('id', id).first();
            res.status(200).json(createResponse(true, updatedNewsItem, 'News item updated successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error updating news item'));
        }
    },

    deleteNewsById: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedRows = await db('news').where('id', id).del();
            if (deletedRows === 0) {
                return res.status(404).json(createResponse(false, null, 'News item not found'));
            }
            res.status(200).json(createResponse(true, null, 'News item deleted successfully'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error deleting news item'));
        }
    },

    getNewsByCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const news = await db('news').where('category_id', categoryId).select('*');
            if (news.length === 0) {
                return res.status(404).json(createResponse(false, null, 'No news found for this category'));
            }
            res.status(200).json(createResponse(true, news, 'News retrieved successfully for the category'));
        } catch (err) {
            console.error(err);
            res.status(500).json(createResponse(false, null, 'Error retrieving news for the category'));
        }
    }
};

module.exports = newsController;
