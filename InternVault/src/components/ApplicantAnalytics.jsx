import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function ApplicantAnalytics({ applicants }) {
    if (!applicants || applicants.length === 0) return null;

    // Ensure we have valid data to prevent charts from breaking
    // 1. Status Distribution
    const statusData = useMemo(() => {
        const counts = applicants.reduce((acc, app) => {
            const status = app.status || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
        }));
    }, [applicants]);

    // 2. Accommodation Requirement
    const accommodationData = useMemo(() => {
        const counts = applicants.reduce((acc, app) => {
            let status = app.accommodation || 'Not Applicable';
            // Simplify statuses
            if (status.includes("Yes")) status = "Required";
            else if (status.includes("No")) status = "Not Required";

            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [applicants]);

    // 3. Gender Ratio
    const genderData = useMemo(() => {
        const counts = applicants.reduce((acc, app) => {
            const gender = app.gender || 'Not Specified';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [applicants]);

    // 4. Year of Study
    const yearData = useMemo(() => {
        const counts = applicants.reduce((acc, app) => {
            const year = app.yearOfStudy || 'Unknown';
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort();
    }, [applicants]);

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Application Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Application Status</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="99%" height={160} minWidth={0} debounce={50}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={50}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Accommodation Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm md:col-span-1 lg:col-span-1">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Accommodation (On-Site)</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="99%" height={160} minWidth={0} debounce={50}>
                            <PieChart>
                                <Pie
                                    data={accommodationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={50}
                                    dataKey="value"
                                >
                                    {accommodationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gender Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Gender Ratio</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="99%" height={160} minWidth={0} debounce={50}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={50}
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Year Chart */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">Year of Study</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="99%" height={160} minWidth={0} debounce={50}>
                            <BarChart data={yearData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" fontSize={10} allowDecimals={false} />
                                <YAxis dataKey="name" type="category" width={50} fontSize={10} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
