import { spawn } from 'child_process';

let rawStdout = '';
let rawStderr = '';

const clearRaw = () => {
  rawStdout = '';
  rawStderr = '';
}
const onChild = (type, printLog) => (data) => {
  const str = data.toString();
  const lines = str.split(/\n/g).map((line) => {
    return line.trim();
  }).filter(Boolean);

  if (printLog) console.log(str);

  if (type === 'out') rawStdout += lines.join('\n');
  if (type === 'err') rawStderr += lines.join('\n');
};

export const runCommand = (command, options, isBackground, printLog) => {
  return new Promise((resolve, reject) => {
    clearRaw();

    let cProcess = null;
    if (isBackground) {
      cProcess = spawn(command, options, {
        stdio: 'ignore',
        detached: true
      });
      cProcess.unref();
      return resolve({ out: rawStdout, err: rawStderr })
    } else {
      cProcess = spawn(command, options);
    }

    const onChildStdout = onChild('out', printLog);
    const onChildStderr = onChild('err', printLog);

    cProcess.stdout.setEncoding('utf8');
    cProcess.stderr.setEncoding('utf8');
    cProcess.stdout.on('data', onChildStdout);
    cProcess.stderr.on('data', onChildStderr);

    cProcess.on('close', () => resolve({ out: rawStdout, err: rawStderr }));
    cProcess.on('error', () => reject({ out: rawStdout, err: rawStderr }));


  });
};
