import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Filter, 
  RotateCcw, 
  Calendar, 
  Layers, 
  MapPin, 
  ArrowUpDown,
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';
import { salesDashboardSampleData, SalesRecord } from '../data/salesDashboardSampleData';

export const InteractiveDashboard: React.FC = () => {
  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [chartView, setChartView] = useState<'sales' | 'margin'>('sales');
  
  // Table sorting & pagination states
  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<'date' | 'sales' | 'profit'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered dataset
  const filteredData = useMemo(() => {
    return salesDashboardSampleData.filter((record) => {
      const matchYear = selectedYear === 'All' || record.year.toString() === selectedYear;
      const matchRegion = selectedRegion === 'All' || record.region === selectedRegion;
      const matchCategory = selectedCategory === 'All' || record.category === selectedCategory;
      return matchYear && matchRegion && matchCategory;
    });
  }, [selectedYear, selectedRegion, selectedCategory]);

  // Aggregate KPI metrics
  const kpis = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalProfit = filteredData.reduce((acc, curr) => acc + curr.profit, 0);
    const totalOrders = filteredData.reduce((acc, curr) => acc + curr.orders, 0);
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    return {
      totalSales,
      totalProfit,
      totalOrders,
      profitMargin,
      aov
    };
  }, [filteredData]);

  // Monthly aggregated data for dynamic chart
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => {
      const records = filteredData.filter((r) => r.month === month);
      const sales = records.reduce((sum, r) => sum + r.sales, 0);
      const profit = records.reduce((sum, r) => sum + r.profit, 0);
      const margin = sales > 0 ? (profit / sales) * 100 : 0;
      return { month, sales, profit, margin };
    });
  }, [filteredData]);

  const maxMonthlySales = useMemo(() => {
    return Math.max(...monthlyData.map((m) => m.sales), 10000);
  }, [monthlyData]);

  // Category aggregations
  const categoryBreakdown = useMemo(() => {
    const categories: ('Technology' | 'Office Supplies' | 'Furniture')[] = ['Technology', 'Office Supplies', 'Furniture'];
    return categories.map((cat) => {
      const records = filteredData.filter((r) => r.category === cat);
      const sales = records.reduce((sum, r) => sum + r.sales, 0);
      const profit = records.reduce((sum, r) => sum + r.profit, 0);
      const margin = sales > 0 ? (profit / sales) * 100 : 0;
      const share = kpis.totalSales > 0 ? (sales / kpis.totalSales) * 100 : 0;
      return { category: cat, sales, profit, margin, share };
    });
  }, [filteredData, kpis.totalSales]);

  // Regional performance
  const regionalBreakdown = useMemo(() => {
    const regions: ('North' | 'South' | 'East' | 'West')[] = ['North', 'South', 'East', 'West'];
    return regions.map((reg) => {
      const records = filteredData.filter((r) => r.region === reg);
      const sales = records.reduce((sum, r) => sum + r.sales, 0);
      const profit = records.reduce((sum, r) => sum + r.profit, 0);
      const margin = sales > 0 ? (profit / sales) * 100 : 0;
      return { region: reg, sales, profit, margin };
    });
  }, [filteredData]);

  // Table items after search & sort
  const tableData = useMemo(() => {
    const searched = filteredData.filter((r) => 
      r.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      r.subCategory.toLowerCase().includes(tableSearch.toLowerCase()) ||
      r.customerSegment.toLowerCase().includes(tableSearch.toLowerCase()) ||
      r.region.toLowerCase().includes(tableSearch.toLowerCase())
    );

    return searched.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') comparison = a.date.localeCompare(b.date);
      if (sortField === 'sales') comparison = a.sales - b.sales;
      if (sortField === 'profit') comparison = a.profit - b.profit;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, tableSearch, sortField, sortOrder]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSelectedYear('All');
    setSelectedRegion('All');
    setSelectedCategory('All');
    setCurrentPage(1);
    setTableSearch('');
  };

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <section id="dashboard" className="py-24 relative overflow-hidden bg-[#050a17]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light text-xs font-mono mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Interactive Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Live Retail Sales{' '}
            <span className="bg-gradient-to-r from-brand-cyan via-brand-purple to-pink-400 bg-clip-text text-transparent">
              Performance Dashboard
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            A real, working demonstration showing how I model KPI metrics, construct interactive slicers, and translate multi-year transaction data into executive visual controls.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="rounded-3xl bg-[#091124] border border-white/15 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-8">
          
          {/* Top Control Bar: Interactive Slicers */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Filters:</span>
              </span>

              {/* Year Filter */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10 text-xs font-mono">
                {['All', '2024', '2025', '2026'].map((year) => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedYear === year
                        ? 'bg-brand-cyan text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10 text-xs font-mono">
                {['All', 'North', 'South', 'East', 'West'].map((region) => (
                  <button
                    key={region}
                    onClick={() => { setSelectedRegion(region); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedRegion === region
                        ? 'bg-brand-purple text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10 text-xs font-mono">
                {['All', 'Technology', 'Office Supplies', 'Furniture'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filter Button */}
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Slicers</span>
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Total Net Sales</span>
                <DollarSign className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {formatINR(kpis.totalSales)}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Modeled Transactions</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Total Profit</span>
                <TrendingUp className="w-4 h-4 text-brand-purple-light" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {formatINR(kpis.totalProfit)}
              </div>
              <div className="text-[11px] font-mono text-brand-purple-light mt-1">
                Realized Net Margin
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Profit Margin</span>
                <Percent className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                {kpis.profitMargin.toFixed(1)}%
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Healthy Efficiency
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Order Volume</span>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {kpis.totalOrders.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Completed Orders
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Avg Order Value (AOV)</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {formatINR(kpis.aov)}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Per Basket Realization
              </div>
            </div>

          </div>

          {/* Central Section: Monthly Trends Chart + Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Interactive Monthly Revenue Chart (8 cols) */}
            <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-cyan" />
                    <span>Monthly Sales &amp; Margin Trajectory</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Dynamic aggregates reflecting your active slicer selections
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl text-xs font-mono">
                  <button
                    onClick={() => setChartView('sales')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      chartView === 'sales'
                        ? 'bg-brand-cyan text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Revenue (₹)
                  </button>
                  <button
                    onClick={() => setChartView('margin')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      chartView === 'margin'
                        ? 'bg-brand-purple text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Margin (%)
                  </button>
                </div>
              </div>

              {/* Responsive SVG Bar / Trend Chart */}
              <div className="h-56 sm:h-64 w-full flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-white/10 px-2">
                {monthlyData.map((item, idx) => {
                  const heightPercent = chartView === 'sales'
                    ? maxMonthlySales > 0 ? (item.sales / maxMonthlySales) * 100 : 0
                    : Math.min(100, Math.max(0, item.margin * 2.8));

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end group/col relative cursor-pointer"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#0c152e] border border-brand-cyan/40 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap">
                        <div className="font-bold text-brand-cyan">{item.month}</div>
                        <div>Sales: {formatINR(item.sales)}</div>
                        <div>Margin: {item.margin.toFixed(1)}%</div>
                      </div>

                      {/* Bar Visual */}
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 group-hover/col:brightness-125 ${
                          chartView === 'sales'
                            ? 'bg-gradient-to-t from-brand-cyan/30 to-brand-cyan border-t border-brand-cyan shadow-glow-cyan'
                            : 'bg-gradient-to-t from-brand-purple/30 to-brand-purple-light border-t border-brand-purple-light shadow-glow-purple'
                        }`}
                        style={{ height: `${Math.max(6, heightPercent)}%` }}
                      />

                      {/* Month Label */}
                      <span className="text-[10px] font-mono text-slate-400 mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-3 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-cyan" />
                  <span>Gross Realized Sales</span>
                </span>
                <span>Peak Volume in Q4 Holiday Season</span>
              </div>

            </div>

            {/* Category Breakdown (4 cols) */}
            <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display mb-1">
                  Category Contributions
                </h3>
                <p className="text-xs text-slate-400 font-mono mb-5">
                  Revenue split &amp; product margins
                </p>

                <div className="space-y-4">
                  {categoryBreakdown.map((item) => (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-medium">{item.category}</span>
                        <span className="text-brand-cyan font-bold">{formatINR(item.sales)}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full transition-all duration-500"
                          style={{ width: `${item.share}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Share: {item.share.toFixed(1)}%</span>
                        <span className="text-emerald-400">Margin: {item.margin.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Summary Pills */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                  Regional Spread
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {regionalBreakdown.map((r) => (
                    <div key={r.region} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <span className="text-slate-300">{r.region}</span>
                      <span className="text-brand-cyan font-bold">{formatINR(r.sales)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Section: Interactive Transaction Records Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <span>Data Explorer ({tableData.length} Records Filtered)</span>
                </h3>
                <p className="text-xs text-slate-400">Inspect underlying rows modeled in this sample dataset</p>
              </div>

              {/* Search Inside Table */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter table rows..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan font-mono"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2.5 px-3">Record ID</th>
                    <th 
                      onClick={() => { setSortField('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                      className="py-2.5 px-3 cursor-pointer hover:text-white"
                    >
                      <div className="flex items-center gap-1">
                        <span>Date</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Region</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Sub-Category</th>
                    <th 
                      onClick={() => { setSortField('sales'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                      className="py-2.5 px-3 cursor-pointer hover:text-white text-right"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Sales (₹)</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      onClick={() => { setSortField('profit'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                      className="py-2.5 px-3 cursor-pointer hover:text-white text-right"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Profit (₹)</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-right">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 text-brand-cyan font-bold">{row.id}</td>
                      <td className="py-2.5 px-3 text-slate-300">{row.date}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {row.region}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{row.category}</td>
                      <td className="py-2.5 px-3 text-slate-400">{row.subCategory}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">{formatINR(row.sales)}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">{formatINR(row.profit)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{row.orders}</td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-500">
                        No transactions match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono text-slate-400">
              <div>
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

          </div>

          {/* Transparency & Methodology Note */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-slate-400 font-mono">
            <Info className="w-4 h-4 text-brand-cyan shrink-0" />
            <span>
              <strong>Engineering Note: </strong>This dashboard is rendered completely client-side in React with responsive SVG rendering, zero external paid chart dependencies, and instantaneous recalculations.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
