import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { RefreshCcw, Mail, HardDrive, Users, TrendingUp } from 'lucide-react';

const EmailDashboard = () => {
    const [overviewData, setOverviewData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('purchases');
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalEmails, setTotalEmails] = useState(0);
    const [totalStorage, setTotalStorage] = useState(0);

    // สีที่ดูทันสมัยและสบายตา
    const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#6366f1', '#ec4899', '#78716c'];

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

    const categoryIcons = {
        'purchases': '🛍️',
        'newsletters': '📰',
        'updates': '🔄',
        'work': '💼',
        'promotions': '🎯',
        'social': '👥',
        'personal': '📧',
        'forums': '💬',
        'spam': '⚠️',
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
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/data/analytics');
            const data = await response.json();
            if (data.success) {
                setOverviewData(data.data);
                calculateTotals(data.data);
            }
        } catch (error) {
            setError('Failed to fetch overview data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (data) => {
        const emails = data.reduce((acc, curr) => acc + curr.emailCount, 0);
        const storage = data.reduce((acc, curr) => acc + parseInt(curr.totalSize || 0), 0);
        setTotalEmails(emails);
        setTotalStorage(storage);
    };

    const fetchCategoryDetails = async (categoryName) => {
        const categoryId = categoryMapping[categoryName];
        if (!categoryId) return;

        try {
            const response = await fetch(`/api/data/analytics/${categoryId}`);
            const data = await response.json();
            if (data.success) {
                setCategoryDetails(data.data);
            }
        } catch (error) {
            console.error('Error fetching category details:', error);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-blue-600">
                        Emails: {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const sortTimeData = (data) => {
        if (!data) return [];
        return [...data].sort((a, b) => {
            const dateA = new Date(a.month + " 1, 2024");
            const dateB = new Date(b.month + " 1, 2024");
            return dateB - dateA;
        });
    };

    const formatBytes = (bytes) => {
        if (!bytes || isNaN(bytes)) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const prepareStorageData = (data) => {
        if (!Array.isArray(data) || data.length === 0) return [];

        try {
            const totalSize = data.reduce((acc, curr) => acc + parseInt(curr.totalSize || 0), 0);
            return data.map(item => ({
                categoryName: item.categoryName || 'Unknown',
                value: parseInt(item.totalSize || 0),
                formattedSize: formatBytes(parseInt(item.totalSize || 0)),
                percentage: totalSize > 0 ? ((parseInt(item.totalSize || 0) / totalSize) * 100).toFixed(1) : '0'
            }));
        } catch (error) {
            console.error('Error preparing storage data:', error);
            return [];
        }
    };

    const StorageTooltip = ({ active, payload }) => {
        if (active && payload && payload.length && payload[0].payload) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{data.categoryName}</p>
                    <p className="text-sm text-gray-600">Size: {data.formattedSize}</p>
                    <p className="text-sm text-blue-600">{data.percentage}% of total</p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null;

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#ffffff"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${(percent * 100).toFixed(1)}%`}
            </text>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Email Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-2">Comprehensive overview of your email categories and usage</p>
                    </div>
                    <button
                        onClick={fetchOverviewData}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Refresh Data
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="flex items-center p-6">
                            <Mail className="w-12 h-12 mr-4" />
                            <div>
                                <p className="text-lg font-medium opacity-90">Total Emails</p>
                                <p className="text-2xl font-bold">{totalEmails.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="flex items-center p-6">
                            <HardDrive className="w-12 h-12 mr-4" />
                            <div>
                                <p className="text-lg font-medium opacity-90">Total Storage</p>
                                <p className="text-2xl font-bold">{formatBytes(totalStorage)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="flex items-center p-6">
                            <Users className="w-12 h-12 mr-4" />
                            <div>
                                <p className="text-lg font-medium opacity-90">Categories</p>
                                <p className="text-2xl font-bold">{Object.keys(categoryMapping).length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Selector */}
                <div className="flex items-center space-x-4 mb-6">
                    <label className="text-sm font-medium text-gray-600">Select Category:</label>
                    <select
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        value={selectedCategory}
                    >
                        {Object.keys(categoryMapping).map((category) => (
                            <option key={category} value={category}>
                                {categoryIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Distribution by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-96">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
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
                                            fill="#0ea5e9"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                            <HardDrive className="w-5 h-5" />
                            Storage Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-96">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={prepareStorageData(overviewData)}
                                            dataKey="value"
                                            nameKey="categoryName"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={120}
                                            label={renderCustomizedLabel}
                                            labelLine={false}
                                        >
                                            {prepareStorageData(overviewData).map((entry, index) => (
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
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
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
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Category Details: {categoryIcons[selectedCategory]} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Top Senders Chart */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Top 10 Senders
                                </h4>
                                <div className="h-[500px]">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={categoryDetails.senderAnalysis}
                                                layout="vertical"
                                                margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: '#4b5563', fontSize: 12 }}
                                                    axisLine={{ stroke: '#9ca3af' }}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="senderEmail"
                                                    tick={{ fill: '#4b5563', fontSize: 12 }}
                                                    width={90}
                                                    axisLine={{ stroke: '#9ca3af' }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    dataKey="emailCount"
                                                    fill="#22c55e"
                                                    radius={[0, 4, 4, 0]}
                                                    barSize={20}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                            {/* Time Trend Chart */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Time Trend Analysis
                                </h4>
                                <div className="h-[500px]">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={sortTimeData(categoryDetails.timeAnalysis)}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fill: '#4b5563', fontSize: 12 }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={60}
                                                />
                                                <YAxis
                                                    tick={{ fill: '#4b5563' }}
                                                    label={{
                                                        value: 'Email Count',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        style: { fill: '#4b5563' }
                                                    }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="emailCount"
                                                    stroke="#f59e0b"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#f59e0b', r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                            {/* Category Stats Cards */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    <CardContent className="p-6">
                                        <h4 className="text-lg font-medium opacity-90">Total Emails in Category</h4>
                                        <p className="text-2xl font-bold mt-2">
                                            {categoryDetails.timeAnalysis?.reduce((acc, curr) => acc + curr.emailCount, 0).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                                    <CardContent className="p-6">
                                        <h4 className="text-lg font-medium opacity-90">Average Monthly Emails</h4>
                                        <p className="text-2xl font-bold mt-2">
                                            {Math.round(categoryDetails.timeAnalysis?.reduce((acc, curr) => acc + curr.emailCount, 0) /
                                                (categoryDetails.timeAnalysis?.length || 1)).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                                    <CardContent className="p-6">
                                        <h4 className="text-lg font-medium opacity-90">Unique Senders</h4>
                                        <p className="text-2xl font-bold mt-2">
                                            {categoryDetails.senderAnalysis?.length.toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-gray-600 text-sm">
                <p>Last updated: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
};

export default EmailDashboard;