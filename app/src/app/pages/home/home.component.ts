import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeroComponent } from '../../components/home/hero/hero.component';
import { MembershipPlansComponent } from '../../components/home/plans/plans.component';
import { LatestNewsComponent } from '../../components/home/news/news.component';
import { TestimonialsComponent } from '../../components/home/testimonials/testimonials.component';
import { StatsBarComponent } from '../../components/home/stats/stats.bar.component';
import { AboutUsComponent } from '../../components/common/about-us/about-us.component';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        HomeHeroComponent,
        MembershipPlansComponent,
        LatestNewsComponent,
        TestimonialsComponent,
        StatsBarComponent,
        AboutUsComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent { }
