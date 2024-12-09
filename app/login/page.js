'use client';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc} from 'firebase/firestore'; 
import init from "../Common/init";
import "./Login.css";
import Link from 'next/link';

export default function Login() {
  const { auth, db } = init(); // Récupérer l'authentification, Firestore et Messaging
  const router = useRouter();

  // Appelé lorsqu'on envoie le formulaire
  function submitForm(e) {
    e.preventDefault();

    // Récupération des champs du formulaire
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Connexion (courriel + mot de passe)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        const user = userCred.user;
        console.log(user);

        // Après la connexion, récupérer et stocker le token FCM
        //storeUserToken(user);

        // Redirection vers la page d'accueil
        router.push('./home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <>
      <form onSubmit={submitForm}>
        <h3 className='Title d-flex justify-content-center'>Login</h3>
        <input type="email" name="email" placeholder='Email' required />
        <input type="password" name="password" placeholder='Password' required />
        <input type="submit" />
      </form>
      <p><Link href="/signup">Inscription</Link></p>
    </>
  );
}
