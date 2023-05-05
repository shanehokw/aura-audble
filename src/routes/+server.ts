import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, cookies }) => {
	const { token } = await request.json();

	cookies.set('token', token);

	return json(true);
}) satisfies RequestHandler;
