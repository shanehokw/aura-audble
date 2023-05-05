import { Particle } from './Particle';

export class Aura {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	colours: string[];
	isMobile: boolean = window.matchMedia('only screen and (max-width: 768px)').matches;
	pixelRatio: number = window.devicePixelRatio > 1 ? 2 : 1;
	totalParticles = 30;
	particles: Particle[] = [];
	maxRadius: number = this.isMobile ? 450 : 900;
	minRadius: number = this.isMobile ? 200 : 400;
	stageWidth: number = document.body.clientWidth;
	stageHeight: number = document.body.clientHeight;
	constructor(canvas: HTMLCanvasElement, colours: string[]) {
		// adapted from https://www.youtube.com/watch?v=D6EiRSRhsbQ&ab_channel=InteractiveDeveloper
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D; // could return null
		this.colours = colours;
		// this.isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		// this.totalParticles = 30;
		// this.particles = [];
		// this.maxRadius = this.isMobile ? 450 : 900;
		// this.minRadius = this.isMobile ? 200 : 400;

		window.addEventListener('resize', this.resize.bind(this), false);
		this.resize();

		window.requestAnimationFrame(this.animate.bind(this));
	}
	resize() {
		// this.stageWidth = document.body.clientWidth;
		// this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		// this.ctx.globalCompositeOperation = "saturation";

		this.createParticles();
	}

	createParticles() {
		let currentColour = 0;
		this.particles = [];

		for (let i = 0; i < this.totalParticles; i++) {
			const particle = new Particle(
				Math.random() * this.stageWidth,
				Math.random() * this.stageHeight,
				Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
				this.colours[currentColour]
			);

			if (++currentColour >= this.colours.length) {
				currentColour = 0;
			}

			this.particles[i] = particle;
		}
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this));

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.totalParticles; i++) {
			const particle = this.particles[i];
			particle.animate(this.ctx, this.stageWidth, this.stageHeight);
		}
	}
}
