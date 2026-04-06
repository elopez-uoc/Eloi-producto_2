import { Component, signal, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JugadoresService, Jugador } from '../common/datos/jugadores.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Video configuration
  defaultVideoSource = 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4';
  
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  // Computed property for current video source
  get currentVideoSource(): string {
    return this.player?.videoUrl || this.defaultVideoSource;
  }

  // Detecta si la URL es de YouTube
  get isYouTubeUrl(): boolean {
    const url = this.player?.videoUrl;
    if (!url) return false;
    return /youtube\.com|youtu\.be/.test(url);
  }

  // Obtiene la URL segura para el iframe de YouTube
  get youtubeEmbedUrl(): SafeResourceUrl {
    const url = this.player?.videoUrl || '';
    const videoId = this.extractYouTubeVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Extrae el ID del video de una URL de YouTube
  private extractYouTubeVideoId(url: string): string {
    if (!url) return '';
    
    // Formato: https://www.youtube.com/watch?v=VIDEO_ID
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // Si ya es solo el ID
    if (url.length === 11 && !/[^0-9A-Za-z_-]/.test(url)) {
      return url;
    }
    
    return '';
  }

  // Inyección de dependencias (API de Angular y servicio Firestore).
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jugadoresService = inject(JugadoresService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

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

  /** Reproduce el video */
  playVideo() {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.play();
    }
  }

  /** Pausa el video */
  pauseVideo() {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.pause();
    }
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
