import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select } from "@/components/ui/select"

const EmailDashboard = () => {
    const [overviewData, setOverviewData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('purchases');
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#9333ea', '#0891b2', '#4f46e5', '#db2777', '#78716c'];

    const categoryMapping = {
        'purchases': '1',
        'newsletters': '2',
        'updates': '3',
        'work': '4',
        'promotions': '5',
        'social': '6',
        'personal': '7',
        'forums': '8',
        'spam': '9',
    };

    useEffect(() => {
        fetchOverviewData();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryDetails(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchOverviewData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/data/analytics/overview');
            const data = await response.json();
            if (data.success) {
                setOverviewData(data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching overview data:', error);
            setLoading(false);
        }
    };

    const fetchCategoryDetails = async (categoryName) => {
        const categoryId = categoryMapping[categoryName];
        if (!categoryId) return;

        try {
            const response = await fetch(`http://localhost:8000/api/data/analytics/category/${categoryId}`);
            const data = await response.json();
            if (data.success) {
                setCategoryDetails(data.data);
            }
        } catch (error) {
            console.error('Error fetching category details:', error);
        }
    };

    // Custom tooltip for better data display
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-blue-600">
                        Emails: {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatBytes = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const prepareStorageData = (data) => {
        return data.map(item => ({
            ...item,
            formattedSize: formatBytes(parseInt(item.totalSize)),
            percentage: ((parseInt(item.totalSize) / data.reduce((acc, curr) => acc + parseInt(curr.totalSize), 0)) * 100).toFixed(1)
        }));
    };

    const StorageTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold text-gray-800">{data.categoryName}</p>
                    <p className="text-sm text-gray-600">Size: {data.formattedSize}</p>
                    <p className="text-sm text-blue-600">{data.percentage}% of total</p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, index, payload }) => {
        const RADIAN = Math.PI / 180;
        const radius = 25 + innerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#374151"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs"
            >
                {payload.categoryName} ({payload.percentage}%)
            </text>
        );
    };


    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">All Email Analytics Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-600">Category:</label>
                    <select
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border rounded-md px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedCategory}
                    >
                        {Object.keys(categoryMapping).map((category) => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl text-gray-800">Email Distribution by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="categoryName"
                                        tick={{ fill: '#4b5563' }}
                                        axisLine={{ stroke: '#9ca3af' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4b5563' }}
                                        axisLine={{ stroke: '#9ca3af' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="emailCount"
                                        fill="#2563eb"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl text-gray-800">Storage Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-96">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-gray-600">Loading data...</div>
                                </div>
                            ) : overviewData.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-gray-600">No data available</div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={prepareStorageData(overviewData)}
                                            dataKey="totalSize"
                                            nameKey="categoryName"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            labelLine={true}
                                            label={renderCustomizedLabel}
                                        >
                                            {overviewData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="#fff"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<StorageTooltip />} />
                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            formatter={(value, entry) => {
                                                const { payload } = entry;
                                                return `${payload.categoryName} (${payload.formattedSize})`;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {categoryDetails && (
                <Card className="shadow-lg mt-8">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl text-gray-800">
                            Category Details: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-[500px]"> {/* Increased height */}
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">Top Senders</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={categoryDetails.senderAnalysis}
                                        layout="vertical" // Changed to vertical layout
                                        margin={{ top: 10, right: 30, left: 100, bottom: 5 }} // Adjusted margins
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e5e7eb"
                                            horizontal={true}
                                        />
                                        <XAxis
                                            type="number"
                                            tick={{ fill: '#4b5563', fontSize: 12 }}
                                            axisLine={{ stroke: '#9ca3af' }}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="senderEmail"
                                            tick={{ fill: '#4b5563', fontSize: 12 }}
                                            width={90} // Control the width of the labels
                                            axisLine={{ stroke: '#9ca3af' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="emailCount"
                                            fill="#16a34a"
                                            radius={[0, 4, 4, 0]} // Rounded corners on right side
                                            barSize={20} // Control bar thickness
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="h-80">
                                <h4 className="text-lg font-semibold mb-4 text-gray-700">Time Trend</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={categoryDetails.timeAnalysis}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: '#4b5563', fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis tick={{ fill: '#4b5563' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="emailCount"
                                            fill="#eab308"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default EmailDashboard;