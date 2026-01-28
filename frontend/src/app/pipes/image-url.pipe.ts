import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  private readonly baseUrl = 'http://localhost:8080';

  transform(url: string | undefined | null, fallback: string = 'https://placehold.co/100'): string {
    if (!url) {
      return fallback;
    }

    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }

    // Fallback for legacy local files if any exist
    if (url.startsWith('/api/media/files/')) {
      return `${this.baseUrl}${url}`;
    }

    // Handle relative paths that might not start with /api
    if (url.startsWith('/')) {
      return `${this.baseUrl}${url}`;
    }

    return url;
  }
}
