// server.js - Fixed version with proper error handling for router imports
const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Define products router directly in this file
const productsRouter = express.Router();

// Get all products
productsRouter.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get product by ID
productsRouter.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', req.params.id)
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

// Add product
productsRouter.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
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

// Update product
productsRouter.put('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update(req.body)
            .eq('id', req.params.id)
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

// Delete product
productsRouter.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Define stocks router directly in this file
const stocksRouter = express.Router();

// Get all stocks
stocksRouter.get('/', async (req, res) => {
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
stocksRouter.get('/:id', async (req, res) => {
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
stocksRouter.get('/product/:product_id', async (req, res) => {
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
stocksRouter.post('/', async (req, res) => {
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
stocksRouter.put('/:id', async (req, res) => {
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
stocksRouter.delete('/:id', async (req, res) => {
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

// Use the products router
app.use("/api/products", productsRouter);
// Use the stocks router
app.use("/api/stocks", stocksRouter);

// Add warehouse router
try {
    const warehouseRouter = require('./routes/warehouse');
    if (typeof warehouseRouter === 'function' || warehouseRouter instanceof express.Router) {
        app.use("/api/warehouse", warehouseRouter);
        console.log('Successfully loaded warehouse routes');
    } else {
        console.error('warehouse router is not a valid Express router');
    }
} catch (error) {
    console.error('Failed to load warehouse router:', error.message);
}

// Try to safely import other routers with error handling
try {
    const audit_logRouter = require('./routes/audit_log');
    if (typeof audit_logRouter === 'function' || audit_logRouter instanceof express.Router) {
        app.use("/api/audit_log", audit_logRouter);
        console.log('Successfully loaded audit_log routes');
    } else {
        console.error('audit_log router is not a valid Express router');
    }
} catch (error) {
    console.error('Failed to load audit_log router:', error.message);
}

try {
    const ordersRouter = require('./routes/orders');
    if (typeof ordersRouter === 'function' || ordersRouter instanceof express.Router) {
        app.use("/api/orders", ordersRouter);
        console.log('Successfully loaded orders routes');
    } else {
        console.error('orders router is not a valid Express router');
    }
} catch (error) {
    console.error('Failed to load orders router:', error.message);
}

// Add suppliers router
try {
    const suppliersRouter = require('./routes/suppliers');
    if (typeof suppliersRouter === 'function' || suppliersRouter instanceof express.Router) {
        app.use("/api/suppliers", suppliersRouter);
        console.log('Successfully loaded suppliers routes');
    } else {
        console.error('suppliers router is not a valid Express router');
    }
} catch (error) {
    console.error('Failed to load suppliers router:', error.message);
}

// Root route
app.get('/', (req, res) => {
    res.send({ message: 'Multi-Warehouse Inventory Management API is Activated'});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});