# Chuck Norris API Tests

## Install dependencies
```bash
npm install
```

## Run Playwright tests
```bash
npx playwright test
```

## Run k6 performance tests
Install k6 first, then run:

```bash
k6 run performance/smoke-load.js
k6 run performance/spike.js
k6 run performance/reliability.js
```
