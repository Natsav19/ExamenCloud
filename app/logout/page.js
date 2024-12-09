'use client'
import init from '../Common/init'
import { signOut } from "firebase/auth"
import { useRouter } from 'next/navigation'
import './logout.css' // Importer le fichier CSS

export default function Logout() {
  const { auth } = init()
  const router = useRouter()

  // Appelé lorsqu'on envoie le formulaire
  function logOut(e) {
    e.preventDefault()

    // Déconnexion
    signOut(auth)
      .then(() => {
        console.log("Logged out")
        router.push('/login')
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  // Annuler la déconnexion et revenir à la page d'accueil
  function cancel() {
    router.push('/home')
  }

  return (
    <div className="logout-container">
      <p className="confirmation-text">Do you really want to log out ?</p>
      <button className="logout-button" onClick={logOut}>Logout</button>
      <button className="cancel-button" onClick={cancel}>Cancel</button>
    </div>
  )
}
