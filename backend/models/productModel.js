const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Please add product name. "],
        trim: true,
    },
    sku: {
        type: String,
        required: true,
        default: "SKU",
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Please add an item category. "],
        trim: true,
    },
    quantity: {
        type: String, 
        required: [true, "Please add item quantity. "],
        trim: true,
    },
    price: {
        type: String,
        required: [true, "Please add item price. "],
        trim: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: [true, "Please add an item description. "],
        trim: true,
    },
    image: {
        type: Object,
        default: {},
    },
}, { timestamps: true,}
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;