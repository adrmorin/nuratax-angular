import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.restoreSession(true).pipe(
        map((isValid) => isValid
            ? true
            : router.createUrlTree(['/'], {
                queryParams: state.url && state.url !== '/' ? { redirectTo: state.url } : undefined
            }))
    );
};
