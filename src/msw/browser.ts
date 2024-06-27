import { http, HttpResponse, delay } from 'msw';
import { setupWorker } from 'msw/browser';

const apiBaseUrl = '/api';

export const worker = setupWorker(
    http.get(`${apiBaseUrl}/short`, () => {
        return HttpResponse.json({ message: 'Short time request' });
    }),

    http.get(`${apiBaseUrl}/long`, async () => {
        await delay(2000);
        return HttpResponse.json({ message: 'Long time request' });
    }),

    http.get(`${apiBaseUrl}/error`, () => {
        return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }),

    http.get(`${apiBaseUrl}/fragile`, ({ request }) => {
        const url = new URL(request.url);
        const successRate = Number(url.searchParams.get('successRate')) / 10;
        const random = Math.random();
        if (random < successRate) {
            return HttpResponse.json({ message: 'Success!' });
        } else {
            return new HttpResponse(null, {
                status: 500,
                statusText: 'Internal Server Error',
            });
        }
    }),
);
