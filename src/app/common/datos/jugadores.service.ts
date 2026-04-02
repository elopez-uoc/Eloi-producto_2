import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, Query, DocumentData, getFirestore, getDocs, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

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
}

@Injectable({
  providedIn: 'root',
})
export class JugadoresService {
  constructor(private firestore: Firestore) {}

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

  addJugador(jugador: Jugador) {
    const jugadoresRef = collection(this.firestore, 'jugadores');
    return addDoc(jugadoresRef, jugador);
  }

  updateJugador(jugador: Jugador) {
    const jugadorDocRef = doc(this.firestore, `jugadores/${jugador.id}`);
    return updateDoc(jugadorDocRef, { ...jugador });
  }

  deleteJugador(id: string) {
    const jugadorDocRef = doc(this.firestore, `jugadores/${id}`);
    return deleteDoc(jugadorDocRef);
  }
}
