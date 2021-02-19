import * as child_process from 'child_process';
import crossSpawn from 'cross-spawn';

// https://medium.com/better-programming/cross-browser-testing-with-testcafe-on-github-actions-49ec58ac855cs

const spawn = (command) => {
  const [c, ...args] = command.split(' ');
  const ps = crossSpawn(c, args);
  ps.stdout.on('data', (data) => console.log('' + data));
  ps.stderr.on('data', (data) => console.error('' + data));
  return ps;
};

const build = () => {
  const result = child_process.execSync(`yarn build:e2e`, { env: { ...process.env, PUBLIC_URL: '/' } });
  console.info('' + result);
};

const serve = () => {
  const server = spawn('yarn serve');
  server.on('close', (code) => console.info('' + code));
  return server;
};

const test = (server) => {
  const browser = process.env.BROWSER || 'chrome';
  const e2e = spawn(`yarn testcafe ${browser} e2e/**/*.spec.{js,ts} --hostname localhost`);
  e2e.on('close', (code) => {
    server.kill();
    process.exit(code);
  });
};

build();
test(serve());
