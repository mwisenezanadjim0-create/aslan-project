import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['breakfast', 'snacks', 'starter', 'soup', 'main', 'sides', 'drinks']
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String,
        default: 'fa-utensils'
    },
    chefSpecial: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
