const Faq = require('../models/FAQ');

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving FAQs', error: error.message });
  }
};

const getQuestionsOnly = async (req, res) => {
  try {
    const faqs = await Faq.find({}, 'q');
    const questions = faqs.map(faq => faq.q);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving questions', error: error.message });
  }
};

const getBotResponse = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        answer: 'Por favor, proporciona una pregunta.', 
        understood: false 
      });
    }

    const faqs = await Faq.find();
    const queryLower = query.toLowerCase();
    
    // Buscar coincidencias exactas en la pregunta
    let exactMatch = faqs.find(faq => 
      queryLower.includes(faq.q.toLowerCase()) || 
      faq.q.toLowerCase().includes(queryLower)
    );
    
    if (exactMatch) {
      return res.status(200).json({
        answer: exactMatch.a,
        understood: true,
        matchedQuestion: exactMatch.q
      });
    }
    
    // Buscar por keywords
    let bestMatch = null;
    let maxKeywordMatches = 0;
    
    faqs.forEach(faq => {
      if (faq.keywords && Array.isArray(faq.keywords)) {
        const keywordMatches = faq.keywords.filter(keyword => 
          queryLower.includes(keyword.toLowerCase())
        ).length;
        
        if (keywordMatches > maxKeywordMatches) {
          maxKeywordMatches = keywordMatches;
          bestMatch = faq;
        }
      }
    });
    
    if (bestMatch && maxKeywordMatches > 0) {
      return res.status(200).json({
        answer: bestMatch.a,
        understood: true,
        matchedQuestion: bestMatch.q,
        keywordMatches: maxKeywordMatches
      });
    }
    
    // Si no hay coincidencias, buscar palabras similares
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    let partialMatch = null;
    let maxWordMatches = 0;
    
    faqs.forEach(faq => {
      const questionWords = faq.q.toLowerCase().split(' ').filter(word => word.length > 2);
      const wordMatches = queryWords.filter(queryWord => 
        questionWords.some(questionWord => 
          questionWord.includes(queryWord) || queryWord.includes(questionWord)
        )
      ).length;
      
      if (wordMatches > maxWordMatches) {
        maxWordMatches = wordMatches;
        partialMatch = faq;
      }
    });
    
    if (partialMatch && maxWordMatches > 0) {
      return res.status(200).json({
        answer: partialMatch.a,
        understood: true,
        matchedQuestion: partialMatch.q,
        confidence: 'partial'
      });
    }
    
    // Si no hay coincidencias, devolver respuesta genérica
    return res.status(200).json({
      answer: 'Lo siento, no encontré una respuesta específica para tu pregunta. ¿Podrías reformularla o preguntar sobre algún tema específico del juego?',
      understood: false
    });
    
  } catch (error) {
    res.status(500).json({
      answer: 'Error interno del servidor', 
      understood: false,
      error: error.message 
    });
  }
};

module.exports = { getAllFaqs, getQuestionsOnly, getBotResponse };
