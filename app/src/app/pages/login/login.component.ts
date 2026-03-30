import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageComponent } from '../../components/common/message/message.component';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, MessageComponent, TranslateModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private translate = inject(TranslateService);
    public modalService = inject(ModalService);

    email = '';
    password = '';
    loading = false;
    error = '';

    onSubmit() {
        this.loading = true;
        this.error = '';

        this.authService.login(this.email, this.password).subscribe({
            next: (user) => {
                console.log('[LoginComponent] login success user:', user);
                console.log('[LoginComponent] currentUser signal after login:', this.authService.currentUser());
                this.loading = false;
                this.modalService.closeLogin();
                const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
                this.router.navigateByUrl(redirectTo || this.authService.currentUserDashboard());
            },
            error: (err) => {
                this.loading = false;
                this.error = this.translate.instant(err.message || 'AUTH.ERROR_LOGIN_FAILED');
                console.error('Login error in component:', err);
            }
        });
    }
}
