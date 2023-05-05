const PI2 = Math.PI * 2;

export class Particle {
	x: number;
	y: number;
	radius: number;
	hex: string;
	vx: number;
	vy: number;
	sinValue: number;

	constructor(x: number, y: number, radius: number, hex: string) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.hex = hex;

		this.vx = Math.random() * 10;
		this.vy = Math.random() * 10;

		this.sinValue = Math.random();
	}

	animate(ctx: CanvasRenderingContext2D, stageWidth: number, stageHeight: number) {
		this.sinValue += 0.01;

		this.radius += Math.sin(this.sinValue);

		this.x += this.vx;
		this.y += this.vy;

		if (this.x < 0) {
			this.vx *= -1;
			this.x += 10;
		} else if (this.x > stageWidth) {
			this.vx *= -1;
			this.x -= 10;
		}

		if (this.y < 0) {
			this.vy *= -1;
			this.y += 10;
		} else if (this.y > stageHeight) {
			this.vy *= -1;
			this.y -= 10;
		}

		ctx.beginPath();
		const gradient = ctx.createRadialGradient(
			this.x,
			this.y,
			this.radius * 0.01,
			this.x,
			this.y,
			this.radius
		);

		// creates points for the colors to gradient in/out
		gradient.addColorStop(0, this.hex + 'FF');
		gradient.addColorStop(1, this.hex + '00');

		ctx.fillStyle = gradient;
		ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
		ctx.fill();
	}
}
