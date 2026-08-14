import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  const res = http.get('https://api.chucknorris.io/jokes/categories');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
