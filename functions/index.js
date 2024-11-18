const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Configuration initiale de SendGrid
const initializeSendGrid = async () => {
  const apiKey = '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';

  if (!apiKey) {
    throw new Error('La clé API SendGrid n\'est pas définie.');
  }

  if (!apiKey.startsWith('SG.')) {
    throw new Error('Format de clé API SendGrid invalide. La clé doit commencer par "SG."');
  }

  try {
    sgMail.setApiKey(apiKey);
    console.log('SendGrid initialisé avec succès');
  } catch (error) {
    throw new Error(`Erreur d'initialisation SendGrid: ${error.message}`);
  }
};

// Configuration CORS
const corsConfig = {
  origin: true, // Permettre toutes les origines. Changez si besoin.
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Fonction principale pour envoyer un email de réinitialisation de mot de passe
exports.sendPasswordResetEmail = functions.https.onRequest(async (req, res) => {
  // Initialisation de SendGrid au démarrage de la fonction
  try {
    await initializeSendGrid();
  } catch (error) {
    console.error('Erreur d\'initialisation:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Erreur de configuration du service d\'envoi d\'emails',
    });
  }

  // Gestion CORS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', corsConfig.origin);
    res.set('Access-Control-Allow-Methods', corsConfig.methods.join(','));
    res.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(','));
    return res.status(204).send('');
  }

  // Validation de la requête
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Adresse e-mail manquante',
    });
  }

  // Configuration du message
  const msg = {
    to: email,
    from: 'ali-essaadaoui@khrija.ma',
    subject: 'Réinitialisation de votre mot de passe',
    text: 'Cliquez sur le lien suivant pour réinitialiser votre mot de passe : [lien de réinitialisation]',
    html: '<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : </p>',
  };

  try {
    await sgMail.send(msg);
    console.log(`Email envoyé avec succès à: ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès',
    });
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    const errorDetails = error.response?.body?.errors?.[0]?.message || error.message;

    return res.status(500).json({
      success: false,
      error: `Erreur lors de l'envoi de l'email: ${errorDetails}`,
    });
  }
});
