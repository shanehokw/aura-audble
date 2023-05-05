// from https://stackoverflow.com/a/63775249
export const calcColourInGradient = (colour1: string, colour2: string, ratio: number) => {
	const tempColour1 = colour1.match(/.{1,2}/g)?.map((oct) => parseInt(oct, 16) * (1 - ratio));
	const tempColour2 = colour2.match(/.{1,2}/g)?.map((oct) => parseInt(oct, 16) * ratio);

	if (!tempColour1 || !tempColour2) return ''; // TODO: see if there's better way to do typesafety here

	const ci = [0, 1, 2].map((i) => Math.min(Math.round(tempColour1[i] + tempColour2[i]), 255));
	return ci
		.reduce((a, v) => (a << 8) + v, 0)
		.toString(16)
		.padStart(6, '0');
};
