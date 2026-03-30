import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
    selector: 'app-bloginfo',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterModule],
    templateUrl: './bloginfo.component.html',
    styleUrl: './bloginfo.component.css'
})
export class BloginfoComponent {
    private blogService = inject(BlogService);
    articles = this.blogService.getArticles();
}
