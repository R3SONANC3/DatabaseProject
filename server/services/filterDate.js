function formatDateToMySQLDateTime(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

const validateTimeFilter = (req, res, next) => {
    const validFilters = ['7d', '1m', '3m', '6m', '1y', '2y', '3y', '4y'];
    const timeFilter = req.query.timeFilter;

    if (!timeFilter || validFilters.includes(timeFilter)) {
        next();
    } else {
        res.status(400).json({
            error: 'Invalid time filter'
        });
    }
};

function getStartDate(timeFilter) {
    const now = new Date();
    
    switch (timeFilter) {
        case '7d':
            return new Date(now.setDate(now.getDate() - 7));
        case '1m':
            return new Date(now.setMonth(now.getMonth() - 1));
        case '3m':
            return new Date(now.setMonth(now.getMonth() - 3));
        case '6m':
            return new Date(now.setMonth(now.getMonth() - 6));
        case '1y':
            return new Date(now.setFullYear(now.getFullYear() - 1));
        case '2y':
            return new Date(now.setFullYear(now.getFullYear() - 2));
        case '3y':
            return new Date(now.setFullYear(now.getFullYear() - 3));
        case '4y':
            return new Date(now.setFullYear(now.getFullYear() - 4));
        case '5y':
            return new Date(now.setFullYear(now.getFullYear() - 5));
        default:
            return new Date(now.setDate(now.getDate() - 7));
    }
}

// Exporting functions
module.exports = {
    formatDateToMySQLDateTime,
    validateTimeFilter,
    getStartDate
};
