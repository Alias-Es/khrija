const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const cors = require('cors')({ origin: true });

// Initialisation Firebase Admin
admin.initializeApp();

// Initialisation de SendGrid
const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

// Fonction pour générer un code de vérification
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Fonction Firebase : Envoi d'email de vérification
exports.sendVerificationEmail = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Méthode non autorisée');
      }

      const { email, prenom } = req.body;
      if (!email || !prenom) {
        console.error('Données manquantes :', { email, prenom });
        return res.status(400).send('L\'email ou le prénom est manquant.');
      }

      const code = generateCode();
      console.log(`Code généré pour ${email}: ${code}`);

      const emailDoc = await admin.firestore().collection('email').doc('kqfC0nsAdQsdNmDfrfeU').get();
      if (!emailDoc.exists) {
        console.error("Le contenu de l'email n'a pas été trouvé dans Firebase.");
        return res.status(500).send("Erreur lors de la récupération du contenu de l'email.");
      }

      const htmlContent = emailDoc.data().codeVerification
        .replace('${prenom}', prenom)
        .replace('${code}', code);

      const message = {
        to: email,
        from: {
          email: 'ali-essaadaoui@khrija.ma',
          name: 'KHRIJA.MA'
        },
        subject: 'Code de vérification',
        html: htmlContent,
      };

      await sgMail.send(message);
      console.log(`Email de vérification envoyé avec succès à : ${email}`);
      return res.status(200).json({ success: true, message: 'Email envoyé avec succès.', code });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
      return res.status(500).send('Erreur lors de l\'envoi de l\'email.');
    }
  });
});

// Fonction Firebase : Envoi d'email de réinitialisation de mot de passe
exports.sendPasswordResetEmail = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Adresse e-mail manquante' });
  }

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
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`Email envoyé avec succès à : ${email}`);
    return res.status(200).json({ success: true, message: 'Email de réinitialisation envoyé avec succès' });
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    const errorDetails = error.response?.body?.errors?.[0]?.message || error.message;
    return res.status(500).json({ success: false, error: `Erreur lors de l'envoi de l'email : ${errorDetails}` });
  }
});
