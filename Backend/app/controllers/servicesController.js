const db = require('../config/db');
const natural = require('natural');
// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await db('services').select('*');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await db('services').where({ id }).first();
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
};

// Get services by category ID
exports.getServicesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const services = await db('services').where({ categories_id: categoryId });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

// Get services by category ID (new API)
exports.getServicesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const services = await db('services').where({ categories_id: categoryId });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services by category ID' });
    }
};

// Search services
exports.searchServices = async (req, res) => {
    const { query } = req.query;
    try {
        const services = await db('services').where('name', 'like', `%${query}%`);
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search services' });
    }
};

// Create a new service
exports.createService = async (req, res) => {
    const { name, description, categories_id, image } = req.body;
    try {
        const [id] = await db('services').insert({ name, description, categories_id, image });
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { name, description, categories_id, image, city } = req.body; // Added city to the destructuring
    try {
        const updated = await db('services').where({ id }).update({ name, description, categories_id, image, city }); // Added city to the update
        if (updated) {
            res.json({ message: 'Service updated successfully' });
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await db('services').where({ id }).del();
        if (deleted) {
            res.json({ message: 'Service deleted successfully' });
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
}; 


// Recommend services
exports.recommendServices = async (req, res) => {
    const { city, category, preference } = req.body;

    try {
        // Lấy tất cả các dịch vụ từ cơ sở dữ liệu
        const services = await db('services').select('*');
        
        // Lấy id của category từ tên category
        const categoryRecord = await db('categories').where('name', category).first();
        const categoryId = categoryRecord ? categoryRecord.id : null;

        // Lọc dịch vụ theo city và categoryId
        const filteredServices = services.filter(service => 
            service.city.toLowerCase() === city.toLowerCase() && 
            service.categories_id === categoryId
        );

        // Tạo đặc trưng từ 'description'
        const tokenizer = new natural.WordTokenizer();
        const inputFeature = tokenizer.tokenize(preference.toLowerCase()).join(' ');

        // Tính độ tương tự cosine giữa input và mỗi dịch vụ
        const serviceScores = filteredServices.map(service => {
            const serviceFeature = tokenizer.tokenize(
                `${service.description}`.toLowerCase()
            ).join(' ');

            // Tính cosine similarity
            const similarity = natural.JaroWinklerDistance(inputFeature, serviceFeature);
            return { service, similarity };
        });

        // Sắp xếp dịch vụ theo độ tương tự
        const sortedServices = serviceScores
            .sort((a, b) => b.similarity - a.similarity)
            .map(({ service }) => service);

        res.json(sortedServices);
    } catch (error) {
        console.error('Failed to recommend services:', error);
        res.status(500).json({ error: 'Failed to recommend services' });
    }
};