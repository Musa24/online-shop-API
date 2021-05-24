import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@Desc   Fetch all products
//@route GET /api/products
// @access public
const costCalculator = asyncHandler(async (req, res) => {
  console.log('Cost Calculator');
});

//@Desc   Fetch all products
//@route GET /api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@Desc   Fetch single product
//@route GET /api/products/:id
// @access private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not Found');
    // res.status(404).json({ message: 'Product not Found' });
  }
});

//@Desc   Delete a product
//@route DELETE /api/products/:id
// @access private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not Found');
  }
});

//@Desc   Create a product
//@route POST /api/products
// @access private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const image =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTBWTZWgZWTWeVQ-Czzk-7UJs-j5JbnrRH7eQ&usqp=CAU';
  const product = new Product({
    name: 'sample Name',
    price: 0,
    user: req.user._id,
    image: image,
    brand: 'brand name',
    category: 'sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@Desc   Update a product
//@route PUT /api/products/:id
// @access private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    brand,
    image,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.brand = brand;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not Found');
  }

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@Desc   Create a new review
//@route POST /api/products/:id/reviews
// @access private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not Found');
  }

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@Desc   Get Top rated Products
//@route  GET /api/products/top
// @access public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  costCalculator,
};
