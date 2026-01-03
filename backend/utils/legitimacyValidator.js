/**
 * Internship Legitimacy Validator
 * Validates internship posting links against scam patterns and trusted platforms
 */

// Trusted hiring platforms - automatically verified
const TRUSTED_PLATFORMS = [
    'internshala.com',
    'linkedin.com',
    'unstop.com',
    'wellfound.com',
    'glassdoor.com',
    'ycombinator.com',
    'indeed.com',
    'naukri.com',
    'angellist.com',
    'greenhouse.io',
    'lever.co',
    'workday.com',
    'myworkdayjobs.com',
    'taleo.net',
    'icims.com',
    'smartrecruiters.com',
    'jobvite.com',
    'hirevue.com'
];

// URL shorteners - automatically flagged
const URL_SHORTENERS = [
    'bit.ly',
    'tinyurl.com',
    'short.link',
    'ow.ly',
    'is.gd',
    't.co',
    'goo.gl',
    'buff.ly',
    'adf.ly',
    'rebrand.ly',
    'cutt.ly',
    'shorturl.at'
];

// Generic form platforms - flagged unless company is a student organization
const GENERIC_FORMS = [
    'docs.google.com',
    'forms.gle',
    'typeform.com',
    'surveymonkey.com',
    'jotform.com',
    'formstack.com',
    'wufoo.com',
    'cognito forms.com'
];

/**
 * Extract domain from URL
 * @param {string} url - The URL to extract domain from
 * @returns {string|null} - The domain or null if invalid
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        let hostname = urlObj.hostname.toLowerCase();

        // Remove 'www.' prefix
        if (hostname.startsWith('www.')) {
            hostname = hostname.substring(4);
        }

        return hostname;
    } catch (error) {
        return null;
    }
}

/**
 * Normalize company name for matching
 * @param {string} companyName - The company name to normalize
 * @returns {string} - Normalized company name
 */
function normalizeCompanyName(companyName) {
    return companyName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, ''); // Remove special characters
}

/**
 * Check if domain matches company name
 * @param {string} companyName - The company name
 * @param {string} domain - The domain to check
 * @returns {boolean} - True if they match
 */
function domainMatchesCompany(companyName, domain) {
    const normalizedCompany = normalizeCompanyName(companyName);
    const normalizedDomain = domain.replace(/\.(com|org|net|io|co|in|ai)$/i, '');

    // Direct match (e.g., "microsoft" matches "microsoft.com")
    if (normalizedDomain.includes(normalizedCompany)) {
        return true;
    }

    // Reverse match (e.g., "Google LLC" matches "google.com")
    if (normalizedCompany.includes(normalizedDomain)) {
        return true;
    }

    // Check for common variations
    // e.g., "Meta" -> "facebook.com" (would need manual mapping for edge cases)

    return false;
}

/**
 * Check if domain is a trusted hiring platform
 * @param {string} domain - The domain to check
 * @returns {boolean} - True if trusted
 */
function isTrustedPlatform(domain) {
    return TRUSTED_PLATFORMS.some(platform => domain.includes(platform));
}

/**
 * Check if URL is a shortener
 * @param {string} domain - The domain to check
 * @returns {boolean} - True if URL shortener
 */
function isUrlShortener(domain) {
    return URL_SHORTENERS.some(shortener => domain.includes(shortener));
}

/**
 * Check if URL is a generic form
 * @param {string} domain - The domain to check
 * @returns {boolean} - True if generic form
 */
function isGenericForm(domain) {
    return GENERIC_FORMS.some(form => domain.includes(form));
}

/**
 * Validate internship posting legitimacy
 * @param {string} companyName - The company name
 * @param {string} link - The application link
 * @returns {Object} - { status: "Verified" | "Flagged", reason: string }
 */
export function validateLegitimacy(companyName, link) {
    // Extract domain from link
    const domain = extractDomain(link);

    if (!domain) {
        return {
            status: "Flagged",
            reason: "Invalid URL format"
        };
    }

    // Check 1: Trusted Hiring Platform (HIGHEST PRIORITY)
    // Check this FIRST to avoid false positives from other checks
    if (isTrustedPlatform(domain)) {
        return {
            status: "Verified",
            reason: "Trusted hiring platform"
        };
    }

    // Check 2: URL Shortener Detection
    if (isUrlShortener(domain)) {
        return {
            status: "Flagged",
            reason: "URL shortener detected"
        };
    }

    // Check 3: Generic Form Detection
    if (isGenericForm(domain)) {
        return {
            status: "Flagged",
            reason: "Generic form platform"
        };
    }

    // Check 4: Domain Matching
    if (domainMatchesCompany(companyName, domain)) {
        return {
            status: "Verified",
            reason: "Domain matches company"
        };
    }

    // Default: Flag if no verification passed
    return {
        status: "Flagged",
        reason: "Domain mismatch with company"
    };
}

export default validateLegitimacy;
