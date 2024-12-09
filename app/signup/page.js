'use client';
import init from '../Common/init';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export default function Signup() {
  const { auth, db } = init(); 
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Ajouter l'utilisateur à Firebase Authentication
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Ajouter un document utilisateur avec le film Avatar par défaut
      await setDoc(doc(db, "users", uid), {
        uid: uid, // Identifiant unique de l'utilisateur
        films: [
          {
            title: "Avatar",
            description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
            genre: "Science-fiction",
            imageUrl: "https://image.cnbcfm.com/api/v1/image/105897632-1557241558937avatar-e1541360922907.jpg?v=1664130328&w=1920&h=1080",
          },
        ], 
      });

      console.log("Utilisateur ajouté avec succès dans Authentication et Firestore avec le film Avatar.");
      router.push('/login');
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
    }
  }

  return (
    <>
      <form onSubmit={submit}>
        <h3 className="Title d-flex justify-content-center">Inscription</h3>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <input type="submit" value="S'inscrire" />
      </form>
    </>
  );
}
