/**
 * `npm run check`: lint, i18n check, build, placeholder scan, in order, each
 * with its own timeout. A step that fails or hangs stops the run with a clear
 * message naming it (and its child processes are killed).
 */
import { spawn } from 'node:child_process';

const steps = [
  { name: 'lint', script: 'lint', timeout: 180 },
  { name: 'i18n:check', script: 'i18n:check', timeout: 60 },
  { name: 'build', script: 'build', timeout: 420 },
  { name: 'scan', script: 'scan', timeout: 300 },
];

const run = ({ name, script, timeout }) =>
  new Promise((resolve) => {
    const started = Date.now();
    // detached: the step gets its own process group, so a timeout kills its children too.
    const child = spawn('npm', ['run', '--silent', script], { stdio: 'inherit', detached: true });
    const timer = setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        child.kill('SIGKILL');
      }
      resolve({ ok: false, why: `timed out after ${timeout} s` });
    }, timeout * 1000);
    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve(code === 0 ? { ok: true, s: ((Date.now() - started) / 1000).toFixed(1) } : { ok: false, why: `exited with code ${code}` });
    });
  });

for (const step of steps) {
  const result = await run(step);
  if (!result.ok) {
    console.error(`\ncheck FAILED at step "${step.name}": ${result.why}.`);
    process.exit(1);
  }
  console.log(`check: ${step.name} OK (${result.s} s)`);
}
console.log('check: all steps passed');
