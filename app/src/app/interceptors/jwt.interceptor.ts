import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { TokenStorageService } from '../services/token-storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenStorage = inject(TokenStorageService);
    const token = tokenStorage.getToken();

    const isOwnApi = req.url.startsWith(environment.apiUrl);
    const isAuthEndpoint = /(\/api\/(users|auth)\/(login|register))(\b|\/|\?)/.test(req.url) || req.url.includes('/assets/');

    if (token && isOwnApi && !isAuthEndpoint) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
};
