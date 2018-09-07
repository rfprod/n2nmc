import { NgModule, ModuleWithProviders } from '@angular/core';

import { TRANSLATION_PROVIDERS} from './translations';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';

/**
 * Translate module without providers.
 */
@NgModule({
	declarations: [ TranslatePipe ],
	exports: [ TranslatePipe ]
})
export class TranslateModuleWithoutProviders {
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: TranslateModuleWithoutProviders,
			providers: [ TRANSLATION_PROVIDERS, TranslateService ]
		};
	}
}

/**
 * Translate module with providers.
 */
export const TranslateModule: ModuleWithProviders = TranslateModuleWithoutProviders.forRoot();
