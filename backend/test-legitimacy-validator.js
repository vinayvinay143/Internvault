/**
 * Test file for legitimacy validator
 * Run with: node test-legitimacy-validator.js
 */

import { validateLegitimacy } from './utils/legitimacyValidator.js';

console.log('🔍 Testing Internship Legitimacy Validator\n');

const testCases = [
    {
        name: 'Trusted Platform - Internshala',
        companyName: 'Google',
        link: 'https://internshala.com/internship/detail/google-internship-2024',
        expected: 'Verified'
    },
    {
        name: 'Trusted Platform - LinkedIn',
        companyName: 'Microsoft',
        link: 'https://www.linkedin.com/jobs/view/12345',
        expected: 'Verified'
    },
    {
        name: 'Domain Match - Microsoft',
        companyName: 'Microsoft',
        link: 'https://careers.microsoft.com/apply',
        expected: 'Verified'
    },
    {
        name: 'Domain Match - Google',
        companyName: 'Google LLC',
        link: 'https://careers.google.com/jobs/results',
        expected: 'Verified'
    },
    {
        name: 'URL Shortener - bit.ly',
        companyName: 'Acme Corp',
        link: 'https://bit.ly/xyz123',
        expected: 'Flagged'
    },
    {
        name: 'URL Shortener - tinyurl',
        companyName: 'Startup Inc',
        link: 'https://tinyurl.com/abc456',
        expected: 'Flagged'
    },
    {
        name: 'Generic Form - Google Forms',
        companyName: 'Student Club',
        link: 'https://docs.google.com/forms/d/e/1FAIpQLSc...',
        expected: 'Flagged'
    },
    {
        name: 'Generic Form - Typeform',
        companyName: 'Random Company',
        link: 'https://typeform.com/to/xyz',
        expected: 'Flagged'
    },
    {
        name: 'Domain Mismatch',
        companyName: 'Google',
        link: 'https://microsoft.com/careers',
        expected: 'Flagged'
    },
    {
        name: 'Invalid URL',
        companyName: 'Test Company',
        link: 'not-a-valid-url',
        expected: 'Flagged'
    }
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    const result = validateLegitimacy(test.companyName, test.link);
    const isPass = result.status === test.expected;

    if (isPass) {
        passed++;
        console.log(`✅ Test ${index + 1}: ${test.name}`);
    } else {
        failed++;
        console.log(`❌ Test ${index + 1}: ${test.name}`);
        console.log(`   Expected: ${test.expected}, Got: ${result.status}`);
    }

    console.log(`   Company: ${test.companyName}`);
    console.log(`   Link: ${test.link}`);
    console.log(`   Result: ${result.status} - ${result.reason}\n`);
});

console.log('━'.repeat(50));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

if (failed === 0) {
    console.log('🎉 All tests passed!\n');
} else {
    console.log('⚠️  Some tests failed. Please review the results above.\n');
}
