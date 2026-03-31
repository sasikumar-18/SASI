const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileshop';

const productSchema = new mongoose.Schema({
    category: String
});

const Product = mongoose.model('Product', productSchema);

async function checkCategories() {
    try {
        await mongoose.connect(mongoURI);
        const categories = await Product.distinct('category');
        console.log('Categories in DB:', categories);

        for (const cat of categories) {
            const count = await Product.countDocuments({ category: cat });
            console.log(`- ${cat}: ${count} products`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCategories();
