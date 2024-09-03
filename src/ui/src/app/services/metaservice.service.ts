import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IMetaTags } from '../library/interfaces/metatags';

@Injectable({
	providedIn: 'root',
})
export class MetaTagManagerService {
	constructor(
		private metaService: Meta,
		private titleService: Title,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private http: HttpClient
	) {}

	initializeMetaTags(): void {
		// Handle initial load
		this.setMetaTags(this.router.routerState.snapshot.url);

		// Handle route changes
		this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
			const url = event.urlAfterRedirects;
			this.setMetaTags(url);
		});
	}

	private setMetaTags(url: string): void {
		const fullPath = url.replace(/^\/+|\/+$/g, '');

		if (fullPath.startsWith('blog/') || fullPath.startsWith('studio/') || fullPath.startsWith('artifact/')) {
			return;
		}

		this.getMetaTags(this.activatedRoute.snapshot, this.router.routerState.snapshot).subscribe((metaTags) => {
			if (metaTags) {
				this.applyMetaTags(metaTags);
			}
		});
	}

	private applyMetaTags(metaTags: any): void {
		if (!metaTags) {
			return;
		}

		this.titleService.setTitle(metaTags.title);
		this.metaService.addTags([
			{ name: 'description', content: metaTags.description || '' },
			{ name: 'keywords', content: metaTags.keywords || '' },
			{ property: 'og:title', content: metaTags['og:title'] || '' },
			{ property: 'og:description', content: metaTags['og:description'] || '' },
			{ property: 'og:image', content: metaTags['og:image'] || '' },
			{ property: 'og:url', content: metaTags['og:url'] || '' },
			{ name: 'twitter:card', content: metaTags['twitter:card'] || '' },
			{ name: 'twitter:title', content: metaTags['twitter:title'] || '' },
			{ name: 'twitter:description', content: metaTags['twitter:description'] || '' },
			{ name: 'twitter:image', content: metaTags['twitter:image'] || '' },
		]);
	}

	getMetaTags(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMetaTags> {
		const fullPath = state.url.replace(/^\/+|\/+$/g, '');

		if (fullPath === '') {
			return of({} as IMetaTags);
		} else {
			const metaTagsUrl = `assets/data/meta/${fullPath}.json`;
			return this.http.get<IMetaTags>(metaTagsUrl).pipe(
				catchError((error) => {
					console.error('Error fetching meta tags:', error);
					return of({} as IMetaTags);
				})
			);
		}
	}
}
