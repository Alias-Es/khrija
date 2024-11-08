import { firebase } from '../FirebaseConfig';
import { SENDGRID_API_KEY } from '@env';

// Fonction pour générer un code de vérification
export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Fonction pour envoyer l'email de vérification
const sendVerificationEmail = async (email, prenom, code) => {
  if (!email || !prenom) {
    throw new Error('L\'email ou le prénom est manquant.');
  }

  const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';
  
  try {
    // Récupération du contenu HTML depuis Firebase
    const emailDoc = await firebase.firestore().collection('email').doc('kqfC0nsAdQsdNmDfrfeU').get();
    if (!emailDoc.exists) {
      throw new Error("Le contenu de l'email n'a pas été trouvé dans Firebase.");
    }

    // Remplace les variables dynamiques dans le contenu récupéré
    const htmlContent = emailDoc.data().codeVerification
      .replace('${prenom}', prenom)
      .replace('${code}', code);

    // Préparer le message pour SendGrid
    const message = {
      personalizations: [
        {
          to: [{ email }],
          subject: 'Code de vérification',
        },
      ],
      from: { email: 'ali-essaadaoui@khrija.ma', name: 'KHRIJA.MA' }, // Remplacez par votre email vérifié
      content: [
        {
          type: 'text/html',
          value: htmlContent,
        },
      ],
    };

    // Envoyer le message via SendGrid
    const response = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(message),
    });

    const responseBody = await response.text();

  
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error(error.message);
  }
};

export default sendVerificationEmail;
