import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

async function loadApi(value) {
  const source = (await readFile(new URL("../src/services/api.js", import.meta.url), "utf8"))
    .replace('"axios"', JSON.stringify(import.meta.resolve("axios")))
    .replaceAll("import.meta.env.VITE_API_URL", JSON.stringify(value));
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`)).default;
}

test("deployment host with trailing newline sends login to the API route", async () => {
  const api = await loadApi("https://mini-hackathon-five-mocha.vercel.app\n");
  assert.equal(api.getUri({ url: "/auth/login" }), "https://mini-hackathon-five-mocha.vercel.app/api/auth/login");
});

test("configured API prefix is retained without duplicate slashes", async () => {
  const api = await loadApi(" https://example.com/api/ \n");
  assert.equal(api.getUri({ url: "/lost-items" }), "https://example.com/api/lost-items");
});

test("blank configuration uses the local development API", async () => {
  const api = await loadApi(" \n");
  assert.equal(api.getUri({ url: "/auth/login" }), "http://localhost:5000/api/auth/login");
});
