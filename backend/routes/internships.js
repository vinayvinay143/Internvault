import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * Proxy route for Findwork API
 * Handles CORS issues by making requests from backend
 */
router.get('/findwork', async (req, res) => {
    try {
        const { search = 'internship', location = '' } = req.query;
        const apiKey = process.env.FINDWORK_API_KEY;

        if (!apiKey || apiKey === 'your_findwork_api_key_here') {
            return res.status(400).json({
                error: 'Findwork API key not configured',
                message: 'Please set FINDWORK_API_KEY in backend .env file'
            });
        }

        const params = new URLSearchParams({
            search,
            ...(location && { location }),
            sort_by: 'relevance'
        });

        const response = await fetch(`https://findwork.dev/api/jobs/?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Findwork API Error: ${response.status}`, errorText);
            return res.status(response.status).json({
                error: 'Findwork API request failed',
                status: response.status,
                message: errorText
            });
        }

        const data = await response.json();

        // Transform data to match frontend format
        const jobs = (data.results || []).map(job => ({
            id: `findwork-${job.id}`,
            title: job.role,
            company: job.company_name,
            location: job.location || 'Remote',
            link: job.url,
            snippet: job.text,
            salary: job.salary_range,
            type: job.employment_type,
            logo: job.logo,
            source: 'Findwork'
        }));

        res.json({ success: true, jobs, count: jobs.length });

    } catch (error) {
        console.error('Findwork proxy error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Proxy route for USA Jobs API
 * Handles CORS issues by making requests from backend
 */
router.get('/usajobs', async (req, res) => {
    try {
        const { keyword = 'internship', location = '' } = req.query;
        const apiKey = process.env.USAJOBS_API_KEY;

        if (!apiKey || apiKey === 'your_usajobs_api_key_here') {
            return res.status(400).json({
                error: 'USA Jobs API key not configured',
                message: 'Please set USAJOBS_API_KEY in backend .env file'
            });
        }

        const userEmail = process.env.USAJOBS_EMAIL && process.env.USAJOBS_EMAIL !== 'your_email@example.com'
            ? process.env.USAJOBS_EMAIL
            : 'internal@internvault.com'; // Fallback email to prevent 400 error

        const params = new URLSearchParams({
            Keyword: keyword,
            ...(location && { LocationName: location }),
            ResultsPerPage: 100
        });

        const headers = {
            'Host': 'data.usajobs.gov',
            'User-Agent': userEmail,
            'Authorization-Key': apiKey
        };
        console.log('USA Jobs Headers:', JSON.stringify({ ...headers, 'Authorization-Key': apiKey ? '***' : 'missing' }));

        const response = await fetch(`https://data.usajobs.gov/api/Search?${params}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`USA Jobs API Error: ${response.status}`, errorText);
            return res.status(response.status).json({
                error: 'USA Jobs API request failed',
                status: response.status,
                message: errorText
            });
        }

        const data = await response.json();
        const results = data.SearchResult?.SearchResultItems || [];

        // Transform data to match frontend format
        const jobs = results.map(item => {
            const job = item.MatchedObjectDescriptor;
            return {
                id: `usajobs-${job.PositionID}`,
                title: job.PositionTitle,
                company: job.OrganizationName || 'U.S. Government',
                location: job.PositionLocationDisplay || 'Various',
                link: job.PositionURI,
                snippet: job.UserArea?.Details?.JobSummary || job.QualificationSummary,
                salary: job.PositionRemuneration?.[0]?.Description || 'See posting',
                type: job.PositionSchedule?.[0]?.Name || 'Full-time',
                source: 'USA Jobs'
            };
        });

        res.json({ success: true, jobs, count: jobs.length });

    } catch (error) {
        console.error('USA Jobs proxy error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Proxy route for Jooble API
 */
router.post('/jooble', async (req, res) => {
    try {
        const { keywords = 'internship', location = 'Remote' } = req.body;
        const apiKey = process.env.JOOBLE_API_KEY;

        if (!apiKey || apiKey === 'your_jooble_api_key_here') {
            return res.status(400).json({
                error: 'Jooble API key not configured',
                message: 'Please set JOOBLE_API_KEY in backend .env file'
            });
        }

        const response = await fetch(`https://jooble.org/api/${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keywords, location })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Jooble API Error: ${response.status}`, errorText);
            return res.status(response.status).json({
                error: 'Jooble API request failed',
                status: response.status,
                message: errorText
            });
        }

        const data = await response.json();

        const jobs = (data.jobs || []).map(job => ({
            id: `jooble-${job.id || Math.random()}`,
            title: job.title,
            company: job.company,
            location: job.location,
            link: job.link,
            snippet: job.snippet,
            salary: job.salary,
            type: job.type,
            source: 'Jooble'
        }));

        res.json({ success: true, jobs, count: jobs.length });

    } catch (error) {
        console.error('Jooble proxy error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * Proxy route for IndianAPI
 */
router.get('/indianapi', async (req, res) => {
    try {
        const { query = 'internship', location = 'India' } = req.query;
        const apiKey = process.env.INDIANAPI_API_KEY;

        if (!apiKey || apiKey === 'your_indianapi_api_key_here') {
            return res.status(400).json({
                error: 'IndianAPI key not configured',
                message: 'Please set INDIANAPI_API_KEY in backend .env file'
            });
        }

        const params = new URLSearchParams({
            query,
            location,
            limit: 20
        });

        const response = await fetch(`https://indianapi.in/api/jobs?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`IndianAPI Error: ${response.status}`, errorText);
            return res.status(response.status).json({
                error: 'IndianAPI request failed',
                status: response.status,
                message: errorText
            });
        }

        const data = await response.json();

        const jobs = (data.data || []).map(job => ({
            id: `indianapi-${job.id || Math.random()}`,
            title: job.title || job.job_title,
            company: job.company || job.company_name,
            location: job.location || 'India',
            link: job.url || job.apply_link,
            snippet: job.description,
            salary: job.salary,
            type: job.job_type,
            source: 'IndianAPI'
        }));

        res.json({ success: true, jobs, count: jobs.length });

    } catch (error) {
        console.error('IndianAPI proxy error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

export default router;
