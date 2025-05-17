// routes/stocks.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Express router
const router = express.Router();

// Get all stocks
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stocks')
            .select('*');
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get stock by ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stocks')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (!data) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get stock by product ID
router.get('/product/:product_id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stocks')
            .select('*')
            .eq('product_id', req.params.product_id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Add stock
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stocks')
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

// Update stock
router.put('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stocks')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Delete stock
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('stocks')
            .delete()
            .eq('id', req.params.id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router;