const https = require('https');

const data = JSON.stringify({
    amount: 100,
    receipt: 'test_receipt'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/payments/create-order',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
