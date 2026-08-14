import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  const endpoints = [
    'https://api.chucknorris.io/jokes/random',
    'https://api.chucknorris.io/jokes/categories',
    'https://api.chucknorris.io/jokes/search?query=chuck',
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(endpoint);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'content-type is JSON': (r) => r.headers['Content-Type']?.includes('application/json') ?? false,
  });

  sleep(0.5);
}
