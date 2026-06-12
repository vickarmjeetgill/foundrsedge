const fetch = require('node:http');

// Helper to make requests
async function makeRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = require('node:http').request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING OFFERS API TESTS ===");

  // 1. Test GET /api/offers
  console.log("\n1. Testing GET /api/offers (Public Feed)...");
  try {
    const res = await makeRequest('http://localhost:3000/api/offers', 'GET');
    console.log(`Status: ${res.status}`);
    console.log('Response:', JSON.stringify(res.body).substring(0, 200) + '...');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();
