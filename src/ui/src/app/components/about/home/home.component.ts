import { Component } from '@angular/core';
import initAOS, { cleanAOS } from '../../../library/invokers/animate-on-scroll';
import { disableParallax, initParallax } from '../../../library/invokers/parallax';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { environment } from '../../../../environment/environment';


@Component({
	selector: 'app-home',
	standalone: true,
	imports: [RouterModule, NgFor],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
    webassets:string = environment.cdnUrl;
	socialLinks = [
		{
			platform: 'Instagram',
			icon: 'ai-instagram',
			url: 'https://instagram.com/jsm33t',
		},
		{
			platform: 'Facebook',
			icon: 'ai-facebook',
			url: 'https://facebook.com/iamjsm33t',
		},
		{
			platform: 'YouTube',
			icon: 'ai-github',
			url: 'https://github.com/jsm33t',
		},
	];

	ngOnDestroy(): void {
		cleanAOS();
        disableParallax();
	}

	ngOnInit(): void {
		initParallax();
		initAOS();
	}
}
