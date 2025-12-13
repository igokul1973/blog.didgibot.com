#!/usr/bin/env node

/**
 * Enforce per-file coverage >= 90% for all reported files in coverage/coverage-final.json.
 * Excluded files should already be omitted by Vite/Vitest coverage config.
 */
const fs = require('fs');
const path = require('path');

const COVERAGE_PATH = path.join(process.cwd(), 'coverage', 'coverage-final.json');
const THRESHOLD = 90;

if (!fs.existsSync(COVERAGE_PATH)) {
    console.error(`❌ Coverage file not found: ${COVERAGE_PATH}`);
    process.exit(1);
}

const content = fs.readFileSync(COVERAGE_PATH, 'utf8');
let data;
try {
    data = JSON.parse(content);
} catch (err) {
    console.error('❌ Failed to parse coverage JSON:', err);
    process.exit(1);
}

const failures = [];
for (const [filePath, metrics] of Object.entries(data)) {
    const pct = metrics?.lines?.pct ?? 0;
    if (pct < THRESHOLD) {
        failures.push({ filePath, pct });
    }
}

if (failures.length > 0) {
    console.error('❌ Coverage enforcement failed. Files below threshold:');
    failures.forEach(({ filePath, pct }) => {
        console.error(`  - ${filePath}: ${pct}% (required: ${THRESHOLD}%)`);
    });
    process.exit(1);
}

console.log(`✅ Coverage enforcement passed: all files >= ${THRESHOLD}%`);
