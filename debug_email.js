
const validateEmail = (email) => {
    console.log(`Testing: "${email}"`);

    // 1. One @ symbol
    const match = email.match(/@/g);
    if ((match || []).length !== 1) {
        return "Email must contain exactly one '@' symbol.";
    }

    // 6. No spaces
    if (/\s/.test(email)) {
        return "Email must not contain spaces.";
    }

    // 9. Consecutive dots or special chars (dots)
    if (/\.\./.test(email)) {
        return "Email must not contain consecutive dots.";
    }

    // Local part:
    const [localPart, domainPart] = email.split('@');

    // 2 & 3. content before and after @
    if (!localPart || !domainPart) {
        return "Email must have characters before and after '@'.";
    }

    // 8. Should not start or end with special characters
    // Check local part start/end
    if (/^[^a-zA-Z0-9]/.test(localPart) || /[^a-zA-Z0-9]$/.test(localPart)) {
        return "Username part of email must not start or end with special characters.";
    }
    // Check domain part start
    if (/^[^a-zA-Z0-9]/.test(domainPart)) {
        return "Domain part of email must not start with special characters.";
    }

    // 5. Allowed chars: letters, numbers, dots. Fix: move hyphen to end
    if (/[^a-zA-Z0-9._@-]/.test(email)) {
        return "Email contains invalid characters.";
    }

    // 4. Domain valid extension
    if (!domainPart.includes('.')) {
        return "Domain must include a valid extension.";
    }
    const lastDotIndex = domainPart.lastIndexOf('.');
    if (lastDotIndex === domainPart.length - 1) { // Ends with dot
        return "Email must not end with a special character (dot).";
    }
    const extension = domainPart.substring(lastDotIndex + 1);
    if (extension.length < 2) {
        return "Invalid domain extension.";
    }

    // 9. Avoid consecutive special chars (._-)
    if (/[\.\_\-]{2,}/.test(email)) {
        return "Email must not contain consecutive special characters.";
    }

    return "VALID";
};

console.log(validateEmail("_@sai@gmail.com"));
console.log(validateEmail("_sai@gmail.com"));
console.log(validateEmail("sai@gmail.com"));
