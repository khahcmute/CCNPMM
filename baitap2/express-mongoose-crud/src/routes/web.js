const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home page
router.get('/', homeController.getHomePage);

// CRUD routes
router.get('/crud', homeController.getCRUD);
router.post('/post-crud', homeController.postCRUD);
router.get('/get-crud', homeController.displayGetCRUD);
router.get('/edit-crud', homeController.getEditCRUD);
router.post('/put-crud', homeController.putCRUD);
router.get('/delete-crud', homeController.deleteCRUD);

module.exports = router;