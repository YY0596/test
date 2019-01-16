import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import { Patch } from './patch';

Patch.FixBags();

platformBrowserDynamic().bootstrapModule(AppModule);
