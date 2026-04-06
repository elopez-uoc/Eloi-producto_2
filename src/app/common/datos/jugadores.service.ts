import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, Query, DocumentData, getFirestore, getDocs, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

// Modelo de datos para un jugador de baloncesto.
// Se usa para tipar las operaciones CRUD en Firestore.
export interface Jugador {
  id?: string;
  nombre: string;
  equipo: string;
  posicion: string;
  altura: string;
  edad: number;
  pPP: number;
  rPP: number;
  aPP: number;
  porcentajeTiros: number;
  img: string;
  videoUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class JugadoresService {
  constructor(private firestore: Firestore) {}

  /**
   * Lee todos los documentos de la colección "jugadores" desde Firestore.
   * Devuelve un Observable de array de Jugador.
   */
  getJugadores(): Observable<Jugador[]> {
    return from(getDocs(collection(this.firestore, 'jugadores'))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Jugador))),
      tap(data => console.log('Jugadores desde Firestore:', data)),
      catchError(err => {
        console.error('Error fetching players:', err);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un jugador por su id.
   * Si no existe, devuelve null.
   */
  getJugador(id: string): Observable<Jugador | null> {
    console.log('Fetching player with id:', id);
    return from(getDoc(doc(this.firestore, `jugadores/${id}`))).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          console.log('Player data:', snapshot.data());
          return { id: snapshot.id, ...snapshot.data() } as Jugador;
        } else {
          console.log('Player not found for id:', id);
          return null;
        }
      }),
      catchError(err => {
        console.error('Error fetching player:', err);
        return of(null);
      })
    );
  }

  /**
   * Crea un nuevo jugador en Firestore.
   */
  addJugador(jugador: Jugador) {
    const jugadoresRef = collection(this.firestore, 'jugadores');
    return addDoc(jugadoresRef, jugador);
  }

  /**
   * Actualiza un jugador existente en Firestore. Requiere id válido en el objeto.
   */
  updateJugador(jugador: Jugador) {
    const jugadorDocRef = doc(this.firestore, `jugadores/${jugador.id}`);
    return updateDoc(jugadorDocRef, { ...jugador });
  }

  /**
   * Elimina un jugador de Firestore por id.
   */
  deleteJugador(id: string) {
    const jugadorDocRef = doc(this.firestore, `jugadores/${id}`);
    return deleteDoc(jugadorDocRef);
  }
}
