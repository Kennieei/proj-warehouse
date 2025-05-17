// routes/products.js - CommonJS version
const express = require('express');
const Router = express.Router();
const supabase = require('../SupabaseClient');

// Get all products
Router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('warehouse')
            .select('*');
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get a specific product
Router.get('/:id', async (req, res) => {
    try {
        // Validate ID is a number (assuming numeric IDs)
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const { data, error } = await supabase
            .from('warehouse')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (!data) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Create a new product
Router.post('/', async (req, res) => {
    try {
        // Basic input validation
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is required' });
        }

        const { data, error } = await supabase
            .from('warehouse')
            .insert([req.body])
            .select();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(201).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Update a product
Router.put('/:id', async (req, res) => {
    try {
        // Validate ID is a number (assuming numeric IDs)
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Basic input validation
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Request body is required' });
        }

        const { data, error } = await supabase
            .from('warehouse')
            .update(req.body)
            .eq('id', id)
            .select();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Delete a product
Router.delete('/:id', async (req, res) => {
    try {
        // Validate ID is a number (assuming numeric IDs)
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const { error } = await supabase
            .from('warehouse')
            .delete()
            .eq('id', id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = Router;