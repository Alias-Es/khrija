const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

const initializeSendGrid = async () => {
  const apiKey = process.env.SENDGRID_API_KEY || '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';

  if (!apiKey) {
    throw new Error('La clé API SendGrid n\'est pas définie.');
  }

  try {
    sgMail.setApiKey(apiKey);
    console.log('SendGrid initialisé avec succès');
  } catch (error) {
    throw new Error(`Erreur d'initialisation SendGrid: ${error.message}`);
  }
};

exports.sendPasswordResetEmail = functions.https.onRequest(async (req, res) => {
  // Configuration CORS simplifiée
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    await initializeSendGrid();
  } catch (error) {
    console.error('Erreur d\'initialisation:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Erreur de configuration du service d\'envoi d\'emails'
    });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Adresse e-mail manquante'
    });
  }

  // Construction du lien direct sans utiliser Firebase Dynamic Links
  const resetLink = `monprojetexpo://reset-password?email=${encodeURIComponent(email)}`;
  console.log('Lien de réinitialisation généré:', resetLink);

  const msg = {
    to: email,
    from: 'ali-essaadaoui@khrija.ma',
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder :</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;"
             data-bypass-tracking="true">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur mobile :</p>
        <p style="word-break: break-all;">${resetLink}</p>
        <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </div>
    `,
    trackingSettings: {
      clickTracking: { enable: false },
      openTracking: { enable: false },
      subscriptionTracking: { enable: false },
      ganalytics: { enable: false }
    }
  };

  try {
    await sgMail.send(msg);
    console.log(`Email envoyé avec succès à : ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Email de réinitialisation envoyé avec succès'
    });
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    const errorDetails = error.response?.body?.errors?.[0]?.message || error.message;
    return res.status(500).json({
      success: false,
      error: `Erreur lors de l'envoi de l'email : ${errorDetails}`
    });
  }
});

