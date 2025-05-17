// routes/orders.js
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

// Get all orders
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*');
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (!data) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
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

// Update order
router.put('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', req.params.id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// IMPORTANT: Export the router
module.exports = router;