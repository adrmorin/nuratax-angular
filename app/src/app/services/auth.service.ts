import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user-interface';
import { TokenStorageService } from './token-storage.service';

interface LoginResponse {
    token: string;
    userId: string;
    firstName: string;
    lastName: string;
}

interface ApiEnvelope<T> {
    success?: boolean;
    responseCode?: string;
    message?: string;
    data?: T;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private tokenStorage = inject(TokenStorageService);

    private baseUrl = `${environment.apiUrl}/api/auth`;
    private loggedIn = new BehaviorSubject<boolean>(false);
    isLoggedIn = this.loggedIn.asObservable();

    private sessionChecked = false;
    private restoreSessionRequest$: Observable<boolean> | null = null;

<<<<<<< HEAD
        const token = localStorage.getItem('token');
        const expiry = localStorage.getItem('token_expiry');

        if (token && expiry && Date.now() < parseInt(expiry, 10)) {
            return {
                firstName: localStorage.getItem('fallback_firstName') || '',
                lastName: localStorage.getItem('fallback_lastName') || '',
                email: localStorage.getItem('fallback_email') || '',
                phone: '',
                password: '',
                roles: ['ROLE_FREE'],
                isValidated: false
            };
        }

        return null;
    }

    public currentUser = signal<User | null>(this.getInitialOptimisticUser());
=======
    public currentUser = signal<User | null>(null);
>>>>>>> b010ee2287c0f3f281777bc740b543e4d3da4330
    public currentUserDashboard = computed(() => {
        const user = this.currentUser();
        if (!user) return '/free-dashboard';

        let roles = user.roles || [];
        if (roles.length === 0 && user.authorities) {
            roles = user.authorities.map(a => a.authority || '');
        }

        return this.getDashboardRoute(roles);
    });

    login(email: string, password: string): Observable<User> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        const body = { email, password };

        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body, { headers }).pipe(
            tap((response) => {
                console.log('[AuthService] /login response:', response);
            }),
            switchMap((response) => this.handleSuccessfulLogin(response, email)),
            catchError((err) => {
                console.error('Login error:', err);
                return throwError(() => new Error('AUTH.ERROR_LOGIN_FAILED'));
            })
        );
    }

    checkLoginStatus(force = true): void {
        this.restoreSession(force).subscribe((isValid) => {
            if (!isValid && this.isProtectedRoute(this.router.url)) {
                this.router.navigate(['/']);
            }
        });
    }

    restoreSession(force = false): Observable<boolean> {
        const token = this.getToken();
        if (!token) {
            this.clearSessionState();
            this.sessionChecked = true;
            return of(false);
        }

        if (!force && this.sessionChecked) {
            return of(this.loggedIn.getValue());
        }

        if (!force && this.restoreSessionRequest$) {
            return this.restoreSessionRequest$;
        }

        const request$ = this.validateToken().pipe(
            switchMap(() =>
                this.loadCurrentUser().pipe(
                    tap((user) => {
                        this.currentUser.set(user);
                        this.loggedIn.next(true);
                    }),
                    map(() => true),
                    catchError((error) => {
                        console.error('Failed to load user info on session restore:', error);
                        this.clearSessionState();
                        return of(false);
                    })
                )
            ),
            catchError((error) => {
                console.error('Session validation failed:', error);
                this.clearSessionState();
                return of(false);
            }),
            tap((isValid) => {
                if (!isValid) {
                    this.currentUser.set(null);
                    this.loggedIn.next(false);
                }
                this.sessionChecked = true;
            }),
            finalize(() => {
                this.restoreSessionRequest$ = null;
            }),
            shareReplay(1)
        );

        this.restoreSessionRequest$ = request$;
        return request$;
    }

    getToken(): string | null {
        if (!this.tokenStorage.hasValidToken()) {
            this.clearSessionState();
            return null;
        }

        return this.tokenStorage.getToken();
    }

    hasStoredSession(): boolean {
        return this.tokenStorage.hasValidToken();
    }

    getAuthenticatedRedirectUrl(): string {
        return this.currentUserDashboard() || '/free-dashboard';
    }

    logout(): void {
        this.clearSessionState();
        this.router.navigate(['/']);
    }

    validateToken(): Observable<boolean> {
        return this.http.get(`${this.baseUrl}/validate-token`, { headers: this.getAuthHeaders() }).pipe(
            map(() => true)
        );
    }

    getUserInfo(): Observable<User> {
        return this.loadCurrentUser();
    }

    private handleSuccessfulLogin(response: LoginResponse, email: string): Observable<User> {
        if (!response?.token) {
            throw new Error('Server did not return a valid access token.');
        }

        console.log('[AuthService] handleSuccessfulLogin raw response:', response);

        this.tokenStorage.saveSession(response.token, {
            email,
            firstName: response.firstName || '',
            lastName: response.lastName || ''
        });

        this.sessionChecked = true;
        this.loggedIn.next(true);

        return this.loadCurrentUser().pipe(
            tap((user) => {
                console.log('[AuthService] normalized user after /user-info:', user);
                this.currentUser.set(user);
            }),
            catchError((error) => {
                console.error('Failed to load user info after login:', error);
                const fallbackUser = this.buildFallbackUser(email, response.firstName, response.lastName);
                console.log('[AuthService] fallback user after login error:', fallbackUser);
                this.currentUser.set(fallbackUser);
                return of(fallbackUser);
            })
        );
    }

    private loadCurrentUser(): Observable<User> {
        return this.http.get<ApiEnvelope<User & { name?: string; username?: string }> | (User & { name?: string; username?: string })>(`${this.baseUrl}/user-info`, { headers: this.getAuthHeaders() }).pipe(
            tap((data) => {
                console.log('[AuthService] /user-info raw response:', data);
            }),
            map((data) => this.normalizeUser(this.unwrapUserResponse(data)))
        );
    }

    private normalizeUser(data: User & { name?: string; username?: string }): User {
        const user: User = {
            ...data,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            password: data.password || '',
            username: data.username || '',
            roles: data.roles || ['ROLE_FREE'],
            enabled: !!data.enabled,
            identityVerified: !!data.identityVerified,
            identityVerifiedAt: data.identityVerifiedAt || null,
            isValidated: !!data.identityVerified
        };

        if (data.name && !user.firstName) {
            const parts = data.name.split(' ');
            user.firstName = parts[0] || '';
            user.lastName = parts.slice(1).join(' ') || '';
        }

        if (!user.email && user.username && user.username.includes('@')) {
            user.email = user.username;
        }

        if (!user.firstName && user.username && !user.username.includes('@')) {
            user.firstName = user.username.trim();
        }

        if (!user.firstName && user.email) {
            user.firstName = this.deriveDisplayNameFromEmail(user.email);
        }

        if (!user.roles || user.roles.length === 0) {
            user.roles = ['ROLE_FREE'];
        }

        return user;
    }

    private unwrapUserResponse(data: ApiEnvelope<User & { name?: string; username?: string }> | (User & { name?: string; username?: string })): User & { name?: string; username?: string } {
        if (data && typeof data === 'object' && 'data' in data && data.data && typeof data.data === 'object') {
            return data.data;
        }

        return data as User & { name?: string; username?: string };
    }

    private getFallbackUser(): User | null {
        const profile = this.tokenStorage.getFallbackProfile();
        if (!profile.email && !profile.firstName && !profile.lastName) {
            return null;
        }

        return this.buildFallbackUser(profile.email, profile.firstName, profile.lastName);
    }

    private buildFallbackUser(email: string, firstName?: string, lastName?: string): User {
        return {
            firstName: firstName || this.deriveDisplayNameFromEmail(email),
            lastName: lastName || '',
            email,
            username: email,
            phone: '',
            password: '',
            enabled: false,
            identityVerified: false,
            identityVerifiedAt: null,
            roles: ['ROLE_FREE'],
            isValidated: false
        };
    }

    private deriveDisplayNameFromEmail(email: string): string {
        const emailPrefix = email.split('@')[0]?.trim();
        return emailPrefix || '';
    }

    private isProtectedRoute(url: string): boolean {
        const [path] = url.split('?');
        const protectedRoutes = [
            '/home',
            '/dashboard',
            '/clients',
            '/returns',
            '/upload',
            '/calculator',
            '/profile',
            '/settings',
            '/agent',
            '/herramientas-ia',
            '/reports',
            '/free-dashboard',
            '/premium-dashboard',
            '/schedule1-a',
            '/f1040s1'
        ];

        return protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
    }

    private getDashboardRoute(roles: string[]): string {
        if (roles.includes('ROLE_AGENT')) return '/agent';
        if (roles.includes('ROLE_VIP')) return '/dashboard';
        if (roles.includes('ROLE_PREMIUM')) return '/premium-dashboard';
        if (roles.includes('ROLE_FREE')) return '/free-dashboard';
        if (roles.includes('ROLE_USER_HOME')) return '/home';
        return '/free-dashboard';
    }

    private getAuthHeaders(): Record<string, string> {
        const token = this.tokenStorage.getToken();
        return token
            ? { Authorization: `Bearer ${token}` }
            : {};
    }

    private clearSessionState(): void {
        this.tokenStorage.clearSession();
        this.loggedIn.next(false);
        this.currentUser.set(null);
<<<<<<< HEAD
        this.alreadyChecked = false;
        this.router.navigate(['/']);
    }

    checkLoginStatus(): boolean {
        const token = this.getToken();
        if (!token) {
            this.loggedIn.next(false);
            this.alreadyChecked = true;
            return false;
        }

        if (!this.alreadyChecked) {
            if (!this.currentUser()) {
                this.currentUser.set({
                    firstName: localStorage.getItem('fallback_firstName') || '',
                    lastName: localStorage.getItem('fallback_lastName') || '',
                    email: localStorage.getItem('fallback_email') || '',
                    phone: '',
                    password: '',
                    roles: ['ROLE_FREE'],
                    isValidated: false
                });
            }

            this.validateToken().subscribe({
                next: () => {
                    this.loggedIn.next(true);
                    this.alreadyChecked = true;
                    this.getUserInfo().subscribe({
                        next: (user) => {
                            console.log('User info loaded on app init:', user);
                            this.currentUser.set(user);
                        },
                        error: (err) => {
                            console.error('Failed to load user info on init:', err);
                            this.currentUser.set({
                                firstName: localStorage.getItem('fallback_firstName') || '',
                                lastName: localStorage.getItem('fallback_lastName') || '',
                                email: localStorage.getItem('fallback_email') || '',
                                phone: '',
                                password: '',
                                roles: ['ROLE_FREE'],
                                isValidated: false
                            });
                        }
                    });
                },
                error: () => {
                    this.loggedIn.next(false);
                    this.logout();
                }
            });
        }

        return this.loggedIn.getValue();
    }

    validateToken(): Observable<unknown> {
        return this.http.get(`${this.baseUrl}/validate-token`, { headers: this.getAuthHeaders() });
    }

    getUserInfo(): Observable<User> {
        console.log('Calling getUserInfo() - fetching user data from backend...');

        return this.http.get<User & { name?: string }>(`${this.baseUrl}/user-info`, { headers: this.getAuthHeaders() }).pipe(
            map((data) => {
                const user: User = {
                    ...data,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    password: data.password || '',
                    roles: data.roles || ['ROLE_FREE'],
                    isValidated: !!data.isValidated
                };

                if (data.name && !user.firstName) {
                    const parts = data.name.split(' ');
                    user.firstName = parts[0] || '';
                    user.lastName = parts.slice(1).join(' ') || '';
                }

                if (!user.firstName) {
                    user.firstName = '';
                }

                if (!user.roles || user.roles.length === 0) {
                    user.roles = ['ROLE_FREE'];
                }

                return user;
            })
        );
    }

    private getAuthHeaders(): Record<string, string> {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
        };
=======
        this.sessionChecked = false;
        this.restoreSessionRequest$ = null;
>>>>>>> b010ee2287c0f3f281777bc740b543e4d3da4330
    }
}
