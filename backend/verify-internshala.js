import { validateLegitimacy } from './utils/legitimacyValidator.js';

const result = validateLegitimacy('Google', 'https://internshala.com/internship/detail/google');
console.log(JSON.stringify(result, null, 2));

if (result.status === 'Verified') {
    console.log("PASS: Internshala verified as trusted.");
} else {
    console.log("FAIL: Internshala NOT verified. Got: " + result.status);
    process.exit(1);
}
