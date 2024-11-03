// FirebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAqbbvi46SDMk-MngpGCXyVoNO_aF-sgJQ',              // Clé API Web
  authDomain: 'khrija-280e8.firebaseapp.com',                     // Domaine d'authentification Firebase
  projectId: 'khrija-280e8',                                      // ID du projet Firebase
  storageBucket: 'khrija-280e8.appspot.com',                      // Bucket de stockage
  messagingSenderId: '1002817459666',                             // Numéro d'expéditeur GCM
  appId: '1:1002817459666:ios:40f37bad8ebb19a275a40b',            // ID de l'application Firebase
  clientId: '1002817459666-r4l77rj0rifqsn8tqbb9ngc3u65ikp5v.apps.googleusercontent.com',  // ID du client OAuth 2.0
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
