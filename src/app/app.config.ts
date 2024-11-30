import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { tr_TR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import tr from '@angular/common/locales/tr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { marketReducer } from './states/market.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from './environments/environment';

registerLocaleData(tr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(tr_TR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore({
      markets: marketReducer
    }),

    // StoreDevtoolsModule'u sadece geliştime ortamında aktif tutuyoruz
    ...(environment.production ? [] : [
      importProvidersFrom(
        StoreDevtoolsModule.instrument({
          maxAge: 25, // Time travel limit
          logOnly: environment.production, // Geliştirme ortamında logOnly
        })
      ),
    ]),
  ]
};
