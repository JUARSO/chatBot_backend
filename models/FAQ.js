const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  id: String,
  q: String,
  a: String,
  keywords: [String],
});

module.exports = mongoose.model('Faq', faqSchema, 'Faqs');
