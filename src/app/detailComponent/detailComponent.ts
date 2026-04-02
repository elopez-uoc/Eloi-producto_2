import { Component, signal, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JugadoresService, Jugador } from '../common/datos/jugadores.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detailComponent.html',
  styleUrl: './detailComponent.css'
})
export class DetailComponent implements OnInit {
  protected readonly title = signal('CODEA-Producto1');
  player: Jugador | null = null;
  isEditing = false;
  isNew = false;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jugadoresService = inject(JugadoresService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Detail component, id from route:', id);
      if (id === 'new') {
        this.isNew = true;
        this.isEditing = true;
        this.player = {
          nombre: '',
          equipo: '',
          posicion: '',
          altura: '',
          edad: 0,
          pPP: 0,
          rPP: 0,
          aPP: 0,
          porcentajeTiros: 0,
          img: ''
        };
        this.cdr.detectChanges();
      } else if (id) {
        this.isNew = false;
        this.jugadoresService.getJugador(id).subscribe(player => {
          console.log('Player received:', player);
          this.player = player;
          this.cdr.detectChanges();
        });
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  savePlayer() {
    if (this.player) {
      if (this.isNew) {
        this.jugadoresService.addJugador(this.player).then(docRef => {
          console.log('Nuevo jugador añadido con ID:', docRef.id);
          this.isEditing = false;
          this.isNew = false;
          this.router.navigate(['/detail', docRef.id]);
        }).catch(error => {
          console.error('Error añadiendo jugador:', error);
        });
      } else {
        this.jugadoresService.updateJugador(this.player).then(() => {
          this.isEditing = false;
          console.log('Jugador actualizado');
        }).catch(error => {
          console.error('Error actualizando:', error);
        });
      }
    }
  }
}