const BASE_URL = "http://localhost:3000";

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

async function getJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(`${path} failed with status ${res.status}`);
  return data;
}

await test("Dashboard aggregate API returns summary and activity", async () => {
  const data = await getJson("/api/dashboard/aggregate");

  if (data.success !== true) throw new Error("Expected success true");
  if (!data.summary) throw new Error("Missing summary object");
  if (!Array.isArray(data.activity)) throw new Error("Activity should be an array");
});

await test("Events API returns event list", async () => {
  const data = await getJson("/api/events");

  if (!Array.isArray(data)) throw new Error("Events response should be an array");
});

await test("Offers API returns offer list", async () => {
  const data = await getJson("/api/offers");

  if (!Array.isArray(data)) throw new Error("Offers response should be an array");
});

await test("Feed API returns paginated feed response", async () => {
  const data = await getJson("/api/feed?page=1&limit=5");

  if (data.success !== true) throw new Error("Expected success true");
  if (typeof data.page !== "number") throw new Error("Missing page number");
  if (!Array.isArray(data.posts)) throw new Error("Posts should be an array");
});

await test("Notifications API returns notification list", async () => {
  const data = await getJson("/api/notifications");

  if (data.success !== true) throw new Error("Expected success true");
  if (!Array.isArray(data.notifications)) throw new Error("Notifications should be an array");
});

console.log("\nIntegration smoke test completed.");