#!/usr/bin/env node

/**
 * Enforce per-file coverage >= 90% for all reported files in coverage/coverage-final.json.
 * Excluded files should already be omitted by Vite/Vitest coverage config.
 */
const fs = require('fs');
const path = require('path');

const SUMMARY_PATH = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
const FINAL_PATH = path.join(process.cwd(), 'coverage', 'coverage-final.json');
const THRESHOLD = 90;

const coveragePath = fs.existsSync(SUMMARY_PATH) ? SUMMARY_PATH : fs.existsSync(FINAL_PATH) ? FINAL_PATH : null;

if (!coveragePath) {
    console.error(`❌ Coverage file not found. Expected either:\n  - ${SUMMARY_PATH}\n  - ${FINAL_PATH}`);
    process.exit(1);
}

const content = fs.readFileSync(coveragePath, 'utf8');
let data;
try {
    data = JSON.parse(content);
} catch (err) {
    console.error('❌ Failed to parse coverage JSON:', err);
    process.exit(1);
}

const computePct = (metrics) => {
    const linePct = metrics?.lines?.pct;
    if (linePct != null) return linePct;

    // Fall back to statement coverage when line summary is missing (coverage-final.json shape)
    const statements = metrics?.s ? Object.values(metrics.s) : [];
    const total = statements.length;
    if (total === 0) return null;
    const covered = statements.filter((count) => count > 0).length;
    return Math.round((covered / total) * 100);
};

const failures = [];
for (const [filePath, metrics] of Object.entries(data)) {
    if (filePath === 'total') continue; // skip aggregate

    const pct = computePct(metrics);
    if (pct == null) continue; // nothing to enforce for empty/unrecorded files

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
