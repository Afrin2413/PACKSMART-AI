import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History, Search, Filter, Download, Trash2, Eye, PlusCircle,
  AlertTriangle, RefreshCw, Clock, ArrowRight, FileText
} from 'lucide-react';
import api from '../services/api';
import { AnalysisListItem } from '../types';
import RiskBadge from '../components/RiskBadge';

export const HistoryPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const data = await api.analyses.getAll();
      setAnalyses(data);
    } catch (err) {
      console.error('Failed to load history analyses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete analysis #${id}?`)) {
      try {
        await api.analyses.delete(id);
        setAnalyses(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert('Failed to delete analysis');
      }
    }
  };

  const handleDownload = async (id: number, commodity: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.analyses.downloadReportPdf(id, commodity);
    } catch (err) {
      alert('Failed to download PDF report');
    }
  };

  const filteredAnalyses = analyses.filter(item => {
    const matchesSearch = item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.recommended_material.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Fruits', 'Vegetables', 'Bakery', 'Snacks', 'Meat', 'Dairy', 'Grains'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-lime">
              HISTORICAL RECORD REPOSITORY
            </span>
          </div>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <History className="w-6 h-6 text-brand-lime" />
            My Packaging Analyses
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            View, compare, export PDF reports, and track past decision-support evaluations.
          </p>
        </div>

        <Link
          to="/new-analysis"
          className="btn-primary text-xs py-2.5 px-4 shadow-glow-lime self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="lab-card p-4 border-charcoal-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
          <input
            type="text"
            placeholder="Search by commodity name or material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lab-input pl-10 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-emerald text-warm-100 border border-brand-lime/40 shadow-sm'
                  : 'bg-charcoal-900 text-warm-400 border border-charcoal-700 hover:text-warm-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Analyses Table Card */}
      <div className="lab-card p-5 sm:p-6 border-charcoal-700">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-lime animate-spin mx-auto" />
            <p className="text-xs text-warm-300 font-mono">Retrieving analysis history from database...</p>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-brand-amber mx-auto" />
            <h3 className="text-sm font-bold text-warm-100">No Packaging Analyses Found</h3>
            <p className="text-xs text-warm-400 max-w-sm mx-auto">
              No matching analyses were found for your current search filter.
            </p>
            <Link to="/new-analysis" className="btn-primary text-xs inline-flex">
              Run Your First Analysis
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-900 text-warm-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">ID & Date</th>
                  <th className="p-3">Commodity</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Recommended Solution</th>
                  <th className="p-3">Target Shelf Life</th>
                  <th className="p-3">Est. Unit Cost</th>
                  <th className="p-3">Eco Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {filteredAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-3 font-mono text-warm-400">
                      <div className="text-warm-200 font-bold">#{item.id}</div>
                      <div className="text-[10px] text-warm-500">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-warm-100">{item.commodity}</td>
                    <td className="p-3 text-warm-300">{item.category}</td>
                    <td className="p-3 font-semibold text-brand-lightlime max-w-xs truncate">
                      {item.recommended_material}
                    </td>
                    <td className="p-3 text-warm-300">{item.shelf_life_days} Days</td>
                    <td className="p-3 text-brand-amber font-mono font-semibold">
                      ₹{item.cost_inr.toFixed(2)}
                    </td>
                    <td className="p-3 font-bold text-emerald-400 font-mono">
                      {item.sustainability_score.toFixed(0)}%
                    </td>
                    <td className="p-3">
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/analysis/${item.id}`}
                        className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-warm-200 border border-charcoal-700 inline-flex items-center gap-1"
                        title="View Analysis"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-lime" />
                      </Link>

                      <button
                        onClick={(e) => handleDownload(item.id, item.commodity, e)}
                        className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-brand-lime border border-charcoal-700 inline-flex items-center gap-1"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-red-950 text-red-400 border border-charcoal-700 inline-flex items-center gap-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
