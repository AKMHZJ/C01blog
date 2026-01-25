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

    if (url.startsWith('/api/media/files/')) {
      return `${this.baseUrl}${url}`;
    }

    if (url.startsWith('http')) {
      return url;
    }

    // Handle relative paths that might not start with /api
    if (url.startsWith('/')) {
      return `${this.baseUrl}${url}`;
    }

    return url;
  }
}
