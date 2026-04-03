import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { JugadoresService, Jugador } from '../common/datos/jugadores.service';
import { PlayerFilterPipe } from '../common/pipes/player-filter.pipe';
import { searchTextSignal, filterFieldSignal, PlayerFilterField } from '../common/state/search-state';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink, PlayerFilterPipe],
  templateUrl: './playersComponent.html',
  styleUrl: './playersComponent.css'
})
export class PlayersComponent implements OnInit {
  // Texto de título del componente.
  protected readonly title = signal('NG-E-Producto2');

  // Stream observable que contiene la lista de jugadores.
  players$!: Observable<Jugador[]>;

  // Accesores para señales de filtro global.
  get searchText(): string {
    return searchTextSignal();
  }

  get filterField(): PlayerFilterField {
    return filterFieldSignal();
  }

  // Jugador seleccionado en la UI (si aplica).
  selectedPlayer: Jugador | null = null;

  constructor(private jugadoresService: JugadoresService) {
    console.log('PlayersComponent initialized with title:', this.title());
  }

  ngOnInit() {
    // Leer lista inicial de jugadores al iniciar el componente.
    this.players$ = this.jugadoresService.getJugadores();
  }

  /** Marca un jugador como seleccionado.
   *  Esto puede usarse para mostrar detalles o estado UI adicional.
   */
  selectPlayer(player: Jugador): void {
    this.selectedPlayer = player;
  }

  /** Elimina jugador tomando confirmación de usuario y refrescando la lista. */
  deletePlayer(id: string): void {
    if (confirm('¿Estás seguro de que quieres borrar este jugador?')) {
      this.jugadoresService.deleteJugador(id).then(() => {
        console.log('Jugador borrado');
        this.players$ = this.jugadoresService.getJugadores();
      }).catch(error => {
        console.error('Error borrando jugador:', error);
      });
    }
  }
}
