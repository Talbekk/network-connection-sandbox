// src/mocks/handlers.ts
import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/gorilla', async () => {
    await delay(10000);
    return HttpResponse.json({ message: 'Hello from the other side' });
  })
];
