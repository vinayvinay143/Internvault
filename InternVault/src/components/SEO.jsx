import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

export default function SEO({ title, description, keywords, name, type }) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={name} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}

SEO.defaultProps = {
    title: 'InternVault - Verify Internships & Detect Scams',
    description: 'InternVault helps students verify internship opportunities, detect fake offers with AI, and find legitimate career paths. Protecting your early career.',
    keywords: 'internship verification, scam detector, fake internships, remote internships, intern vault, internship reviews, career safety, legit internships',
    name: 'InternVault',
    type: 'website'
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
};
