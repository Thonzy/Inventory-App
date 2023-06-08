const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const fileSizeFormatter = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;