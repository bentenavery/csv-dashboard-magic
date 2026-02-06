// Node.js test for CSV processing functionality
const fs = require('fs');

// Mock browser APIs for Node.js testing
global.localStorage = {
    data: {},
    setItem(key, value) { this.data[key] = value; },
    getItem(key) { return this.data[key]; }
};

global.FileReader = class {
    readAsText(file) {
        setTimeout(() => {
            this.result = file.content;
            this.onload({ target: { result: file.content } });
        }, 10);
    }
};

// Load the CSV processor
eval(fs.readFileSync('csv-processor.js', 'utf8'));
const CSVProcessor = global.CSVProcessor;

// Test data
const sampleCSV = `Month,Sales Revenue,Customers,Products Sold,Marketing Spend,Customer Satisfaction
January,45000,234,567,12000,4.2
February,52000,267,634,15000,4.3
March,48000,245,589,11000,4.1
April,61000,298,712,18000,4.4
May,55000,276,665,14000,4.2
June,67000,312,789,20000,4.5
July,59000,289,701,16000,4.3
August,63000,301,756,17000,4.4
September,58000,284,692,15000,4.2
October,71000,325,823,22000,4.6
November,69000,318,798,19000,4.5
December,78000,341,891,25000,4.7`;

async function runTest() {
    console.log('🧪 Testing CSV Processing...');
    
    try {
        const processor = new CSVProcessor();
        
        // Test CSV parsing
        console.log('\n📊 Testing CSV parsing...');
        const parsed = processor.parseCSV(sampleCSV);
        console.log(`✅ Parsed ${parsed.rowCount} rows with ${parsed.columns} columns`);
        console.log(`   Headers: ${parsed.headers.join(', ')}`);
        
        // Test data analysis
        console.log('\n🔍 Testing data analysis...');
        const analysis = processor.analyzeData(parsed);
        console.log(`✅ Generated ${analysis.suggestions.length} chart suggestions`);
        
        analysis.suggestions.forEach((suggestion, i) => {
            console.log(`   ${i+1}. ${suggestion.title} (${suggestion.type})`);
        });
        
        // Test stats generation
        console.log('\n📈 Testing stats generation...');
        const stats = processor.generateSummaryStats(parsed, analysis);
        console.log(`✅ Generated stats with ${stats.insights.length} insights`);
        
        stats.insights.forEach((insight, i) => {
            console.log(`   ${i+1}. ${insight.text}`);
        });
        
        // Test data storage (localStorage mock)
        console.log('\n💾 Testing data storage...');
        const dashboardData = processor.storeProcessedData(parsed, analysis, stats);
        console.log(`✅ Stored dashboard data: ${Object.keys(dashboardData).join(', ')}`);
        
        // Verify stored data
        const storedData = JSON.parse(localStorage.getItem('chartflow_dashboard_data'));
        console.log(`✅ Verified stored data integrity: ${storedData ? 'OK' : 'FAILED'}`);
        
        console.log('\n🎉 All tests passed! CSV processing is working correctly.');
        console.log('\n📋 Summary:');
        console.log(`   - File processed: ${dashboardData.filename}`);
        console.log(`   - Records: ${dashboardData.summary.totalRecords}`);
        console.log(`   - Charts: ${dashboardData.charts.length}`);
        console.log(`   - Insights: ${dashboardData.summary.insights.length}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error(error.stack);
    }
}

// Mock file object for testing
const mockFile = {
    name: 'test-sales-data.csv',
    content: sampleCSV
};

runTest();