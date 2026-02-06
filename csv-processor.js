/**
 * ChartFlow CSV Processor
 * Handles CSV file upload, parsing, and chart generation
 */

class CSVProcessor {
    constructor() {
        this.chartTypes = {
            numeric: ['line', 'bar', 'area'],
            categorical: ['pie', 'doughnut', 'bar'],
            temporal: ['line', 'area']
        };
        this.colors = {
            primary: ['#60a5fa', '#a78bfa', '#f472b6', '#fbbf24', '#22c55e', '#f97316'],
            gradients: [
                'linear-gradient(135deg, #60a5fa, #a78bfa)',
                'linear-gradient(135deg, #f472b6, #f97316)',
                'linear-gradient(135deg, #22c55e, #fbbf24)',
                'linear-gradient(135deg, #a78bfa, #60a5fa)'
            ]
        };
    }

    /**
     * Parse CSV file and return structured data
     */
    parseCSV(csvText) {
        try {
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('CSV must have at least a header row and one data row');
            }

            // Parse headers
            const headers = this.parseCSVLine(lines[0]);
            
            // Parse data rows
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const row = this.parseCSVLine(lines[i]);
                    if (row.length === headers.length) {
                        const rowObject = {};
                        headers.forEach((header, index) => {
                            rowObject[header] = row[index];
                        });
                        data.push(rowObject);
                    }
                }
            }

            return {
                headers,
                data,
                rowCount: data.length,
                columns: headers.length
            };
        } catch (error) {
            throw new Error(`Error parsing CSV: ${error.message}`);
        }
    }

    /**
     * Parse a single CSV line handling commas in quoted fields
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    /**
     * Analyze data types and suggest chart types
     */
    analyzeData(parsedData) {
        const { headers, data } = parsedData;
        const analysis = {
            columns: {},
            suggestions: []
        };

        // Analyze each column
        headers.forEach(header => {
            const columnData = data.map(row => row[header]);
            const analysis_result = this.analyzeColumn(header, columnData);
            analysis.columns[header] = analysis_result;
        });

        // Generate chart suggestions
        analysis.suggestions = this.generateChartSuggestions(analysis.columns, data);

        return analysis;
    }

    /**
     * Analyze a single column's data type and characteristics
     */
    analyzeColumn(header, columnData) {
        const nonEmptyData = columnData.filter(value => value && value.toString().trim() !== '');
        
        if (nonEmptyData.length === 0) {
            return { type: 'empty', distinct: 0, sample: [] };
        }

        // Check if numeric
        const numericValues = nonEmptyData.filter(value => !isNaN(parseFloat(value)));
        const isNumeric = numericValues.length > nonEmptyData.length * 0.8;

        // Check if date-like
        const dateValues = nonEmptyData.filter(value => this.isDateLike(value));
        const isDateLike = dateValues.length > nonEmptyData.length * 0.5;

        // Get distinct values
        const distinct = [...new Set(nonEmptyData)];
        const sample = distinct.slice(0, 5);

        let type = 'categorical';
        if (isNumeric) {
            type = 'numeric';
        } else if (isDateLike) {
            type = 'temporal';
        }

        return {
            type,
            distinct: distinct.length,
            sample,
            isNumeric,
            isDateLike,
            values: nonEmptyData
        };
    }

    /**
     * Check if a value looks like a date
     */
    isDateLike(value) {
        const dateRegexes = [
            /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
            /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
            /^\d{2}-\d{2}-\d{4}$/,  // MM-DD-YYYY
            /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i, // Month names
            /^\d{4}$/               // Year only
        ];
        
        return dateRegexes.some(regex => regex.test(value.toString().trim()));
    }

    /**
     * Generate chart suggestions based on data analysis
     */
    generateChartSuggestions(columns, data) {
        const suggestions = [];
        const headers = Object.keys(columns);

        // Find numeric columns for charts
        const numericColumns = headers.filter(header => columns[header].isNumeric);
        const categoricalColumns = headers.filter(header => 
            columns[header].type === 'categorical' && columns[header].distinct <= 10
        );
        const temporalColumns = headers.filter(header => columns[header].type === 'temporal');

        // Time series charts (if we have temporal + numeric data)
        if (temporalColumns.length > 0 && numericColumns.length > 0) {
            numericColumns.forEach(numCol => {
                suggestions.push({
                    type: 'line',
                    title: `${numCol} Over Time`,
                    xColumn: temporalColumns[0],
                    yColumn: numCol,
                    chartType: 'temporal',
                    data: this.prepareTimeSeriesData(data, temporalColumns[0], numCol)
                });
            });
        }

        // Bar charts for categorical vs numeric
        if (categoricalColumns.length > 0 && numericColumns.length > 0) {
            categoricalColumns.forEach(catCol => {
                numericColumns.forEach(numCol => {
                    suggestions.push({
                        type: 'bar',
                        title: `${numCol} by ${catCol}`,
                        xColumn: catCol,
                        yColumn: numCol,
                        chartType: 'categorical',
                        data: this.prepareCategoricalData(data, catCol, numCol)
                    });
                });
            });
        }

        // Pie charts for categorical distribution
        if (categoricalColumns.length > 0) {
            categoricalColumns.forEach(catCol => {
                if (columns[catCol].distinct <= 8) { // Max 8 slices for readability
                    suggestions.push({
                        type: 'doughnut',
                        title: `Distribution of ${catCol}`,
                        column: catCol,
                        chartType: 'distribution',
                        data: this.prepareDistributionData(data, catCol)
                    });
                }
            });
        }

        // Multi-metric comparison (if multiple numeric columns)
        if (numericColumns.length >= 2) {
            suggestions.push({
                type: 'radar',
                title: 'Multi-Metric Comparison',
                columns: numericColumns.slice(0, 6), // Max 6 metrics for readability
                chartType: 'comparison',
                data: this.prepareMultiMetricData(data, numericColumns.slice(0, 6))
            });
        }

        return suggestions.slice(0, 6); // Limit to 6 charts max
    }

    /**
     * Prepare time series data for charts
     */
    prepareTimeSeriesData(data, timeColumn, valueColumn) {
        const sortedData = data.sort((a, b) => {
            const aTime = new Date(a[timeColumn]);
            const bTime = new Date(b[timeColumn]);
            return aTime - bTime;
        });

        return {
            labels: sortedData.map(row => row[timeColumn]),
            datasets: [{
                label: valueColumn,
                data: sortedData.map(row => parseFloat(row[valueColumn]) || 0),
                borderColor: this.colors.primary[0],
                backgroundColor: this.colors.primary[0] + '20',
                tension: 0.4,
                fill: true
            }]
        };
    }

    /**
     * Prepare categorical data for bar charts
     */
    prepareCategoricalData(data, categoryColumn, valueColumn) {
        const grouped = {};
        
        data.forEach(row => {
            const category = row[categoryColumn];
            const value = parseFloat(row[valueColumn]) || 0;
            
            if (!grouped[category]) {
                grouped[category] = { total: 0, count: 0 };
            }
            grouped[category].total += value;
            grouped[category].count += 1;
        });

        const labels = Object.keys(grouped);
        const values = labels.map(label => grouped[label].total);

        return {
            labels,
            datasets: [{
                label: valueColumn,
                data: values,
                backgroundColor: this.colors.primary.slice(0, labels.length),
                borderColor: this.colors.primary.slice(0, labels.length),
                borderWidth: 1
            }]
        };
    }

    /**
     * Prepare distribution data for pie charts
     */
    prepareDistributionData(data, column) {
        const counts = {};
        
        data.forEach(row => {
            const value = row[column];
            counts[value] = (counts[value] || 0) + 1;
        });

        const labels = Object.keys(counts);
        const values = Object.values(counts);

        return {
            labels,
            datasets: [{
                data: values,
                backgroundColor: this.colors.primary.slice(0, labels.length),
                borderWidth: 0
            }]
        };
    }

    /**
     * Prepare multi-metric data for radar charts
     */
    prepareMultiMetricData(data, columns) {
        // Calculate averages for each metric
        const averages = columns.map(column => {
            const values = data.map(row => parseFloat(row[column]) || 0);
            const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
            const max = Math.max(...values);
            
            // Normalize to 0-100 scale
            return Math.round((avg / max) * 100);
        });

        return {
            labels: columns,
            datasets: [{
                label: 'Performance',
                data: averages,
                borderColor: this.colors.primary[2],
                backgroundColor: this.colors.primary[2] + '30',
                pointBackgroundColor: this.colors.primary[2],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: this.colors.primary[2]
            }]
        };
    }

    /**
     * Generate summary statistics
     */
    generateSummaryStats(parsedData, analysis) {
        const { data } = parsedData;
        const numericColumns = Object.keys(analysis.columns).filter(
            col => analysis.columns[col].isNumeric
        );

        const stats = {
            totalRecords: data.length,
            numericColumns: numericColumns.length,
            insights: []
        };

        // Calculate key metrics for numeric columns
        numericColumns.forEach(column => {
            const values = data.map(row => parseFloat(row[column]) || 0);
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);

            stats[column] = {
                sum: Math.round(sum),
                average: Math.round(avg),
                max,
                min,
                growth: this.calculateGrowth(values)
            };
        });

        // Generate insights
        stats.insights = this.generateInsights(stats, numericColumns);

        return stats;
    }

    /**
     * Calculate growth rate from values array
     */
    calculateGrowth(values) {
        if (values.length < 2) return 0;
        
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        if (firstAvg === 0) return 0;
        
        return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
    }

    /**
     * Generate data insights
     */
    generateInsights(stats, numericColumns) {
        const insights = [];
        
        numericColumns.forEach(column => {
            const columnStats = stats[column];
            
            if (columnStats.growth > 10) {
                insights.push({
                    type: 'positive',
                    icon: 'fa-arrow-up',
                    text: `${column} shows strong growth of ${columnStats.growth}%`
                });
            } else if (columnStats.growth < -10) {
                insights.push({
                    type: 'negative',
                    icon: 'fa-arrow-down',
                    text: `${column} declined by ${Math.abs(columnStats.growth)}%`
                });
            }
            
            if (columnStats.max > columnStats.average * 2) {
                insights.push({
                    type: 'info',
                    icon: 'fa-chart-line',
                    text: `${column} has high variability with peak at ${columnStats.max.toLocaleString()}`
                });
            }
        });

        return insights.slice(0, 5); // Limit to 5 insights
    }

    /**
     * Store processed data in localStorage for dashboard
     */
    storeProcessedData(parsedData, analysis, stats) {
        const dashboardData = {
            timestamp: new Date().toISOString(),
            filename: this.currentFilename || 'uploaded-data.csv',
            summary: {
                totalRecords: stats.totalRecords,
                columns: parsedData.headers.length,
                insights: stats.insights
            },
            charts: analysis.suggestions,
            stats: stats,
            rawData: {
                headers: parsedData.headers,
                data: parsedData.data.slice(0, 100) // Store max 100 rows for preview
            }
        };

        localStorage.setItem('chartflow_dashboard_data', JSON.stringify(dashboardData));
        localStorage.setItem('chartflow_last_upload', Date.now().toString());
        
        return dashboardData;
    }

    /**
     * Main processing function
     */
    async processFile(file) {
        try {
            this.currentFilename = file.name;
            
            // Read file content
            const csvText = await this.readFileContent(file);
            
            // Parse CSV
            const parsedData = this.parseCSV(csvText);
            
            // Analyze data
            const analysis = this.analyzeData(parsedData);
            
            // Generate stats
            const stats = this.generateSummaryStats(parsedData, analysis);
            
            // Store for dashboard
            const dashboardData = this.storeProcessedData(parsedData, analysis, stats);
            
            return {
                success: true,
                message: `Successfully processed ${parsedData.rowCount} rows with ${parsedData.columns} columns`,
                data: dashboardData
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error: error
            };
        }
    }

    /**
     * Read file content as text
     */
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            
            reader.readAsText(file);
        });
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.CSVProcessor = CSVProcessor;
}
if (typeof global !== 'undefined') {
    global.CSVProcessor = CSVProcessor;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVProcessor;
}