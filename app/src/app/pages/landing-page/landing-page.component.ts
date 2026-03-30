import { Component, inject, ViewChild, ElementRef, signal, AfterViewInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from '../../components/common/about-us/about-us.component';
import { ModalService } from '../../services/modal.service';
import { HeaderComponent } from '../../components/common/header/header.component';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [RouterLink, CommonModule, AboutUsComponent, HeaderComponent, TranslateModule],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements AfterViewInit {
    public modalService = inject(ModalService);
    private translateService = inject(TranslateService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('heroVideo') videoRef!: ElementRef<HTMLVideoElement>;

    isPlaying = signal(false); // Default to false to ensure content is visible if video fails
    isMuted = signal(false); // Default to unmuted for starting with sound

    ngAfterViewInit() {
        if (this.videoRef && this.videoRef.nativeElement) {
            const video = this.videoRef.nativeElement;

            const initialLang = this.translateService.currentLang || this.translateService.defaultLang || 'en';
            this.updateVideoSource(video, initialLang, true);

            const sub = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
                this.updateVideoSource(video, event.lang, false);
            });
            this.destroyRef.onDestroy(() => sub.unsubscribe());

            // 2. Disable pointer events for hover protection
            video.style.pointerEvents = 'none';

            // 3. Robust Playback: Wait for metadata to ensure video is ready
            video.addEventListener('loadedmetadata', () => {
                // Ensure started as unmuted as requested
                video.muted = false;
                this.isMuted.set(false);

                video.play().catch(err => {
                    console.error('❌ Autoplay unmuted failed, falling back to muted:', err);
                    video.muted = true;
                    this.isMuted.set(true);
                    video.play().catch(e => console.error('Play error after fallback', e));
                });
            }, { once: true });
        }
    }

    private updateVideoSource(video: HTMLVideoElement, lang: string, isInitialLoad: boolean) {
        const wasPlaying = !isInitialLoad && !video.paused && !video.ended;
        const currentTime = isInitialLoad ? 0 : video.currentTime;

        if (lang === 'en') {
            video.src = 'assets/landing/videolanding_en_ingles.mp4';
        } else {
            video.src = 'assets/landing/videolanding_en_es.mp4';
        }

        video.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
        video.setAttribute('disablePictureInPicture', 'true');
        video.load();

        if (wasPlaying) {
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = currentTime;
                video.play().catch(e => console.error('Play error after lang switch', e));
            }, { once: true });
        }
    }

    onPlay() {
        this.isPlaying.set(true);
    }

    onPause() {
        this.isPlaying.set(false);
        const video = this.videoRef.nativeElement;

        // Rule: Always show the last frame when paused
        if (video.currentTime < video.duration) {
            video.currentTime = video.duration;
            console.log('Paused: jumping to last frame');
        }
    }

    togglePlay() {
        const video = this.videoRef.nativeElement;
        if (video.paused) {
            // Rule: If playing from the end, restart
            if (video.currentTime >= video.duration || video.ended) {
                video.currentTime = 0;
            }
            video.play().catch(e => {
                console.error('Error playing:', e);
                // Fallback to muted if unmuted play failed
                video.muted = true;
                this.isMuted.set(true);
                return video.play();
            });
        } else {
            video.pause();
        }
    }

    toggleMute() {
        const video = this.videoRef.nativeElement;
        video.muted = !video.muted;
        this.isMuted.set(video.muted);
    }

    onVideoEnded() {
        // Reproduction Rule: Ensure it stays on last frame
        const video = this.videoRef.nativeElement;
        if (!video.paused) video.pause();
        this.isPlaying.set(false);
    }
}
