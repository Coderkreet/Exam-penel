
import React from 'react';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const Result = () => {
    // Dummy Data for Pie Chart (Question Analysis)
    const pieData = [
        { name: 'Correct', value: 35, color: '#10B981' }, // emerald-500
        { name: 'Incorrect', value: 10, color: '#EF4444' }, // red-500
        { name: 'Skipped', value: 5, color: '#F59E0B' },   // amber-500
    ];

    // Dummy Data for Line Chart (User vs Topper Comparison across sections)
    const comparisonData = [
        { subject: 'React', user: 75, topper: 90 },
        { subject: 'JavaScript', user: 85, topper: 95 },
        { subject: 'CSS', user: 65, topper: 85 },
        { subject: 'HTML', user: 90, topper: 92 },
        { subject: 'Logic', user: 60, topper: 88 },
    ];

    const COLORS = pieData.map(item => item.color);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-text">Exam Result Analysis</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-sm mb-1">Total Score</p>
                    <h3 className="text-3xl font-bold text-primary">75/100</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-sm mb-1">Rank</p>
                    <h3 className="text-3xl font-bold text-text">12<span className="text-sm font-normal text-gray-400">/50</span></h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-sm mb-1">Percentile</p>
                    <h3 className="text-3xl font-bold text-accent">88%</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-sm mb-1">Accuracy</p>
                    <h3 className="text-3xl font-bold text-green-600">78%</h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Pie Chart: Question Distribution */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-text mb-4">Performance Overview</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Graph: Comparison with Topper */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-text mb-4">Topper vs You (Subject-wise)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={comparisonData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="user" stroke="#5d4bb9" strokeWidth={3} name="You" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="topper" stroke="#10B981" strokeWidth={3} name="Topper" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table (Optional extra polish) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-text">Subject Wise Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Total Questions</th>
                                <th className="px-6 py-3">Attempted</th>
                                <th className="px-6 py-3">Correct</th>
                                <th className="px-6 py-3">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-text">React</td>
                                <td className="px-6 py-4">15</td>
                                <td className="px-6 py-4">14</td>
                                <td className="px-6 py-4 text-green-600">12</td>
                                <td className="px-6 py-4 font-bold">75%</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-text">JavaScript</td>
                                <td className="px-6 py-4">20</td>
                                <td className="px-6 py-4">18</td>
                                <td className="px-6 py-4 text-green-600">16</td>
                                <td className="px-6 py-4 font-bold">85%</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-text">CSS</td>
                                <td className="px-6 py-4">10</td>
                                <td className="px-6 py-4">8</td>
                                <td className="px-6 py-4 text-green-600">5</td>
                                <td className="px-6 py-4 font-bold">65%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
