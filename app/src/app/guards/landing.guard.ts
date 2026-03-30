import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const landingGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.hasStoredSession()) {
        return true;
    }

    return authService.restoreSession(true).pipe(
        map((isValid) => isValid
            ? router.createUrlTree([authService.getAuthenticatedRedirectUrl()])
            : true)
    );
};
