import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
        // For now, returning a dummy array to fix the build.
        // In the future, this should fetch the actual post IDs.
        return Promise.resolve([{id: '1'}]);
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
