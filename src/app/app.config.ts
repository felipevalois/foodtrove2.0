import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { IMAGE_CONFIG } from '@angular/common';   // ✅ correct package

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideLottieOptions({ player: () => player }),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning:      true,  // hides NG0913
        disableImageLazyLoadWarning:  true   // optional, hides NG0914
      }
    }
  ]
};
