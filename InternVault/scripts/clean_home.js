const fs = require('fs');
const path = 'C:/Users/vinay/OneDrive/Desktop/c8-c6/Internvault/Internvault/src/pages/home.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);

// Verify lines (indices are 1-based line number - 1)
const startIdx = 658; // Line 659
const endIdx = 991;   // Line 992

console.log('Checking lines...');
console.log('Line 659:', lines[startIdx]);
console.log('Line 992:', lines[endIdx]);

if (lines[startIdx].trim() !== '/*' || lines[endIdx].trim() !== '*/') {
    console.error('Mismatch! Aborting.');
    process.exit(1);
}

// Remove
const count = endIdx - startIdx + 1;
lines.splice(startIdx, count);

fs.writeFileSync(path, lines.join('\n'));
console.log('Successfully removed lines ' + (startIdx + 1) + ' to ' + (endIdx + 1));
