/**
 * Internship API Service
 * Now uses backend proxy to avoid CORS issues
 */

const API_URL = "http://localhost:5000/api/internships";

/**
 * Fetch jobs from Jooble API (via backend proxy)
 * @param {string} keywords - Search keywords (default: "internship")
 * @param {string} location - Location (default: "Remote")
 * @returns {Promise<Array>} Array of job listings
 */
export const fetchJoobleJobs = async (keywords = "internship", location = "Remote") => {
    try {
        const response = await fetch(`${API_URL}/jooble`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords, location }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.warn("Jooble API:", error.message || "Failed to fetch");
            return [];
        }

        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error("Jooble API Error:", error);
        return [];
    }
};

/**
 * Fetch jobs from Arbeitnow API (European/Remote Jobs)
 * @param {string} search - Search query
 * @param {string} location - Location filter
 * @returns {Promise<Array>} Array of job listings
 */
export const fetchArbeitnowJobs = async (search = "internship", location = "") => {
    try {
        // Arbeitnow API is free and doesn't require API key for basic usage
        const params = new URLSearchParams({
            search,
            ...(location && { location })
        });

        const response = await fetch(`https://www.arbeitnow.com/api/job-board-api?${params}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            console.warn("Arbeitnow API: Failed to fetch");
            return [];
        }

        const data = await response.json();
        return (data.data || []).map(job => ({
            id: `arbeitnow-${job.slug || Math.random()}`,
            title: job.title,
            company: job.company_name,
            location: job.location || "Remote",
            link: job.url,
            snippet: job.description,
            salary: job.salary,
            type: job.job_types?.join(", ") || "Full-time",
            tags: job.tags || [],
            source: "Arbeitnow"
        }));
    } catch (error) {
        console.error("Arbeitnow API Error:", error);
        return [];
    }
};

/**
 * Fetch jobs from USA Jobs API (via backend proxy)
 * @param {string} keyword - Search keyword
 * @param {string} location - Location filter
 * @returns {Promise<Array>} Array of job listings
 */
export const fetchUSAJobsJobs = async (keyword = "internship", location = "") => {
    try {
        const params = new URLSearchParams({
            keyword,
            ...(location && { location })
        });

        const response = await fetch(`${API_URL}/usajobs?${params}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const error = await response.json();
            console.warn("USA Jobs API:", error.message || "Failed to fetch");
            return [];
        }

        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error("USA Jobs API Error:", error);
        return [];
    }
};

/**
 * Fetch jobs from all APIs in parallel
 * @param {Object} options - Search options
 * @returns {Promise<Object>} Object containing jobs from all sources
 */
export const fetchAllInternships = async (options = {}) => {
    const {
        keywords = "internship",
        location = "Remote",
        includeJooble = true,
        includeArbeitnow = true,
        includeUSAJobs = true
    } = options;

    // Use fixed array positions for promises to ensure correct destructuring
    const promises = [
        includeJooble ? fetchJoobleJobs(keywords, location) : Promise.resolve([]),
        includeArbeitnow ? fetchArbeitnowJobs(keywords, location) : Promise.resolve([]),
        includeUSAJobs ? fetchUSAJobsJobs(keywords, location) : Promise.resolve([])
    ];

    try {
        const results = await Promise.allSettled(promises);

        const [jooble, arbeitnow, usajobs] = results.map(result =>
            result.status === 'fulfilled' ? result.value : []
        );

        return {
            jooble: jooble || [],
            arbeitnow: arbeitnow || [],
            usajobs: usajobs || [],
            all: [
                ...(jooble || []),
                ...(arbeitnow || []),
                ...(usajobs || [])
            ]
        };
    } catch (error) {
        console.error("Error fetching internships:", error);
        return {
            jooble: [],
            arbeitnow: [],
            usajobs: [],
            all: []
        };
    }
};


/**
 * Get API status (which APIs are configured in backend)
 * @returns {Object} Status of each API
 */
export const getAPIStatus = () => {
    // Since APIs are now proxied through backend, we assume they're available
    // The backend will handle missing API keys
    return {
        jooble: true,
        arbeitnow: true,
        usajobs: true
    };
};
