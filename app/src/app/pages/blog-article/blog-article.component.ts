import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, BlogArticle } from '../../services/blog.service';

@Component({
    selector: 'app-blog-article',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './blog-article.component.html',
    styleUrl: './blog-article.component.css'
})
export class BlogArticleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private blogService = inject(BlogService);

    article = signal<BlogArticle | undefined>(undefined);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const foundArticle = this.blogService.getArticleById(id);
            if (foundArticle) {
                this.article.set(foundArticle);
            } else {
                // Redirect to bloginfo if article doesn't exist
                this.router.navigate(['/bloginfo']);
            }
        }
    }

    goBack(): void {
        // Redirect directly to home as requested
        this.router.navigate(['/']);
    }
}
