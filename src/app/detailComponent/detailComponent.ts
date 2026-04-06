import { Component, signal, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JugadoresService, Jugador } from '../common/datos/jugadores.service';
import { MediaComponent } from '../mediaComponent/mediaComponent';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaComponent],
  templateUrl: './detailComponent.html',
  styleUrl: './detailComponent.css'
})
export class DetailComponent implements OnInit {
  // Título visible en la interfaz
  protected readonly title = signal('CODEA-Producto1');

  // Objeto jugador actual mostrado/edición.
  player: Jugador | null = null;

  // Estados de UI para modo edición y creación.
  isEditing = false;
  isNew = false;

  // Inyección de dependencias (API de Angular y servicio Firestore).
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jugadoresService = inject(JugadoresService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Leer parámetro `id` de la ruta y cargar jugador o iniciar creación.
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Detail component, id from route:', id);

      if (id === 'new') {
        // Modo creación de un nuevo jugador.
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
          img: '',
          videoUrl: ''
        };
        this.cdr.detectChanges();
      } else if (id) {
        // Cargar jugador existente desde Firestore.
        this.isNew = false;
        this.jugadoresService.getJugador(id).subscribe(player => {
          console.log('Player received:', player);
          this.player = player;
          this.cdr.detectChanges();
        });
      }
    });
  }

  /** Alterna el estado de edición en UI. */
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  /** Guarda los cambios del jugador (creación o actualización). */
  savePlayer() {
    if (this.player) {
      if (this.isNew) {
        // Crear nuevo documento.
        this.jugadoresService.addJugador(this.player).then(docRef => {
          console.log('Nuevo jugador añadido con ID:', docRef.id);
          this.isEditing = false;
          this.isNew = false;
          this.router.navigate(['/detail', docRef.id]);
        }).catch(error => {
          console.error('Error añadiendo jugador:', error);
        });
      } else {
        // Actualizar documento existente.
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
