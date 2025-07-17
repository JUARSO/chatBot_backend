const mongoose = require('mongoose');
const fs = require('fs');

// Configuración
const MONGO_URI = 'mongodb+srv://juansolarg26:Q5tKv0WUfbftSc1y@cluster0.19vuxug.mongodb.net/chatBot?retryWrites=true&w=majority&appName=Cluster0';

// Esquema y modelo Mongoose (igual que en index.js)
const faqSchema = new mongoose.Schema({
  id: String,
  q: String,
  a: String,
  keywords: [String]
});

const Faq = mongoose.model('Faq', faqSchema, 'Faqs');

async function uploadFaqs() {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Leer el archivo JSON
    console.log('📖 Leyendo archivo faqs.json...');
    const faqsData = JSON.parse(fs.readFileSync('./faqs.json', 'utf8'));
    console.log(`📋 Encontradas ${faqsData.length} FAQs para subir`);

    // Limpiar la colección existente
    console.log('🧹 Limpiando colección existente...');
    await Faq.deleteMany({});
    console.log('✅ Colección limpiada');

    // Insertar las nuevas FAQs
    console.log('⬆️ Subiendo FAQs a la base de datos...');
    const result = await Faq.insertMany(faqsData);
    console.log(`✅ ${result.length} FAQs subidas exitosamente`);

    // Mostrar las FAQs subidas
    console.log('\n📋 FAQs subidas:');
    result.forEach((faq, index) => {
      console.log(`${index + 1}. ${faq.q}`);
    });

    console.log('\n🎉 ¡Proceso completado exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar el script
uploadFaqs(); 