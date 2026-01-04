/**
 * API Key Diagnostic Script
 * Run this to check which API keys are configured
 */

import { getAPIStatus } from './src/services/internshipApis.js';

console.log('=== API Key Status Check ===\n');

const status = getAPIStatus();

console.log('Jooble API:', status.jooble ? '✅ Configured' : '❌ Not configured');
console.log('Arbeitnow API:', status.arbeitnow ? '✅ Always available (free)' : '❌ Not available');
console.log('USA Jobs API:', status.usajobs ? '✅ Configured' : '❌ Not configured');

console.log('\n=== Environment Variables ===\n');
console.log('VITE_JOOBLE_API_KEY:', import.meta.env.VITE_JOOBLE_API_KEY ? 'Set' : 'Not set');
console.log('VITE_ARBEITNOW_API_KEY:', import.meta.env.VITE_ARBEITNOW_API_KEY ? 'Set (optional)' : 'Not set (optional)');
