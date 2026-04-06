import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mediaComponent.html',
  styleUrl: './mediaComponent.css'
})
export class MediaComponent {
  @Input() videoUrl: string = '';
  @Input() defaultVideoSource: string = 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4';

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  // Detecta si la URL es de YouTube
  get isYouTubeUrl(): boolean {
    const url = this.videoUrl;
    if (!url) return false;
    return /youtube\.com|youtu\.be/.test(url);
  }

  // Obtiene la URL segura para el iframe de YouTube
  get youtubeEmbedUrl(): SafeResourceUrl {
    const videoId = this.extractYouTubeVideoId(this.videoUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Computed property for current video source
  get currentVideoSource(): string {
    if (!this.videoUrl) return this.defaultVideoSource;
    
    // Si es solo un nombre de archivo (sin protocolo), asumimos que está en assets/videos
    if (!this.videoUrl.includes('://') && !this.videoUrl.startsWith('/')) {
      return `/assets/videos/${this.videoUrl}`;
    }
    
    return this.videoUrl;
  }

  // Obtiene el tipo MIME del video basado en la extensión
  get videoType(): string {
    if (!this.videoUrl) return 'video/mp4';
    
    const extension = this.videoUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'ogg':
      case 'ogv': return 'video/ogg';
      case 'avi': return 'video/avi';
      case 'mov': return 'video/quicktime';
      default: return 'video/mp4';
    }
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

  constructor(private sanitizer: DomSanitizer) {}
}