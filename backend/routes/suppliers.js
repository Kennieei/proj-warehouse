// routes/products.js - CommonJS version
const express = require('express');
const Router = express.Router();
const supabase = require('../SupabaseClient');

// Get all products
Router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('suppliers')
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
        const { data, error } = await supabase
            .from('audit_log')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (!data) {
            return res.status(404).json({ message: 'Not found' });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Create a new product
Router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('audit_log')
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
        const { data, error } = await supabase
            .from('audit_log')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'Not found' });
        }
        
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Delete a product
Router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('audit_log')
            .delete()
            .eq('id', req.params.id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json({ message: 'Not Found' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = Router;