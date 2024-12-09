"use client";
import styles from "../page.module.css";
import Link from 'next/link';
import init from "../Common/init";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

export default function PagePrincipale() {
  const { auth, db } = init();
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]); // État pour les films de l'utilisateur
  const [showModal, setShowModal] = useState(false); // État pour le formulaire modal

  useEffect(() => {
    // Surveiller les changements d'état de l'utilisateur
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Récupérer les films de l'utilisateur depuis Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMovies(userData.films || []); // Met à jour les films
        }
      } else {
        setMovies([]); // Réinitialise les films si aucun utilisateur n'est connecté
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Fonction pour ajouter un film
  const addMovie = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const genre = e.target.genre.value;
    const imageUrl = e.target.imageUrl.value;

    if (!user) {
      alert("Vous devez être connecté pour ajouter un film.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        films: arrayUnion({
          title,
          description,
          genre,
          imageUrl,
          addedAt: Timestamp.now(),
        }),
      });

      // Ajouter le film dans l'état local
      setMovies((prevMovies) => [
        ...prevMovies,
        { title, description, genre, imageUrl, addedAt: Timestamp.now() },
      ]);

      // Fermer le modal
      setShowModal(false);
      e.target.reset(); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur lors de l'ajout du film :", error.message);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">The Movie Database</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="btn btn-success"
                  onClick={() => setShowModal(true)} // Ouvrir le modal
                >
                  ➕ Add Movie
                </button>
              </li>
            </ul>
            <div className="ms-3 d-flex align-items-center">
              <span className="text-white me-3">
                {user ? `Connecté: ${user.email}` : "Non connecté"}
              </span>
              {user ? (
                <Link href="/logout">
                  <button className="btn btn-danger">
                    Se déconnecter
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="btn btn-primary">
                    Se connecter
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="row">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div className="card col-lg-4 col-12" key={index}>
              <img src={movie.imageUrl} className="card-img-top" alt={movie.title} />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.description}</p>
                <span className="badge bg-primary">{movie.genre}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4 text-white">Aucun film trouvé pour cet utilisateur.</p>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-wrapper">
            <div className="modal-header">
              <h3>Ajouter un Film</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={addMovie} className="modal-body">
              <div className="form-group">
                <label>Titre</label>
                <input type="text" name="title" placeholder="Titre" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input type="text" name="genre" placeholder="Genre" required />
              </div>
              <div className="form-group">
                <label>URL de l'image</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="URL de l'image"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Ajouter
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
