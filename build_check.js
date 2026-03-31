const { exec } = require('child_process');
exec('npx tsc --noEmit -p tsconfig.app.json', (error, stdout, stderr) => {
    console.log('--- STDOUT ---');
    console.log(stdout.toString().replace(/\x1B\[[0-9;]*[mGK]/g, ''));
    console.log('--- STDERR ---');
    console.log(stderr.toString().replace(/\x1B\[[0-9;]*[mGK]/g, ''));
});
