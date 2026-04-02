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
  protected readonly title = signal('CODEA-Producto1');

  players$!: Observable<Jugador[]>;

  get searchText(): string {
    return searchTextSignal();
  }

  get filterField(): PlayerFilterField {
    return filterFieldSignal();
  }

  selectedPlayer: Jugador | null = null;

  constructor(private jugadoresService: JugadoresService) {
    console.log('PlayersComponent initialized with title:', this.title());
  }

  ngOnInit() {
    this.players$ = this.jugadoresService.getJugadores();
  }

  selectPlayer(player: Jugador): void {
    this.selectedPlayer = player;
  }

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