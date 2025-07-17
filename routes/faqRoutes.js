const express = require('express');
const router = express.Router();
const { getAllFaqs, getQuestionsOnly, getBotResponse } = require('../controllers/faqController');

router.get('/', getAllFaqs);
router.get('/questions', getQuestionsOnly);
router.post('/bot-response', getBotResponse);

module.exports = router;
