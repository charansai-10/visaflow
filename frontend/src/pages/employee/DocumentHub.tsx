import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Search, Eye, Download, Trash2, LayoutGrid, List,
  FileText, Folder, CheckCircle, Clock,
} from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import { Button } from '../../components/ui/Button';

function Card({ children, className = '', padding = 'md' }: { children: ReactNode; className?: string; padding?: 'none' | 'sm' | 'md' | 'lg' }) {
  const p = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${p[padding]} ${className}`}>{children}</div>;
}

type BV = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
function Badge({ variant = 'default' as BV, children }: { variant?: BV; children: ReactNode }) {
  const cls = { default: 'bg-gray-100 text-gray-700', success: 'bg-emerald-50 text-emerald-700', warning: 'bg-amber-50 text-amber-700', error: 'bg-red-50 text-red-700', info: 'bg-blue-50 text-blue-700', purple: 'bg-indigo-50 text-indigo-700' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls[variant]}`}>{children}</span>;
}

const mockDocs = [
  { id: '1', name: 'Passport Copy.pdf', category: 'Identity', size: '2.4 MB', date: 'Apr 15, 2024', status: 'verified', case: 'H1B-2024-001' },
  { id: '2', name: 'Masters Degree Transcript.pdf', category: 'Educational', size: '5.1 MB', date: 'Apr 10, 2024', status: 'verified', case: 'H1B-2024-001' },
  { id: '3', name: 'Job Offer Letter.docx', category: 'Employment', size: '0.3 MB', date: 'Apr 8, 2024', status: 'pending', case: 'GC-2024-032' },
  { id: '4', name: 'Tax Return 2023.pdf', category: 'Financial', size: '1.8 MB', date: 'Apr 5, 2024', status: 'verified', case: 'GC-2024-032' },
  { id: '5', name: 'I-129 Form.pdf', category: 'Forms', size: '0.8 MB', date: 'Mar 20, 2024', status: 'verified', case: 'H1B-2024-001' },
  { id: '6', name: 'Employment Verification.pdf', category: 'Employment', size: '0.4 MB', date: 'Mar 15, 2024', status: 'rejected', case: 'GC-2024-032' },
];

const CATEGORIES = ['All', 'Identity', 'Educational', 'Employment', 'Financial', 'Forms'];

const CATEGORY_EMOJI: Record<string, string> = {
  Identity: '🪪',
  Educational: '🎓',
  Employment: '💼',
  Financial: '💰',
  Forms: '📋',
};

function statusBadge(status: string) {
  if (status === 'verified') return <Badge variant="success">Verified</Badge>;
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>;
  if (status === 'rejected') return <Badge variant="error">Rejected</Badge>;
  return <Badge>{status}</Badge>;
}

export default function DocumentHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [docs, setDocs] = useState(mockDocs);

  const filtered = docs.filter((d) => {
    const matchCat = category === 'All' || d.category === category;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.case.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = docs.length;
  const verified = docs.filter((d) => d.status === 'verified').length;
  const pending = docs.filter((d) => d.status === 'pending').length;

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Hub</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage and track all your immigration documents</p>
          </div>
          <Button onClick={() => navigate('/documents/upload')}>
            <span className="flex items-center gap-2">
              <Upload size={16} />
              Upload Document
            </span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total Documents</p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{verified}</p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pending}</p>
                <p className="text-xs text-gray-500">Pending Review</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters + Search + Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={[
                  'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors',
                  category === cat
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-52"
              />
            </div>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={[
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
                ].join(' ')}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={[
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
                ].join(' ')}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <Card>
            <div className="py-16 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">No documents found</h3>
              <p className="text-sm text-gray-500 mb-4">Try a different search or filter</p>
              <Button onClick={() => navigate('/documents/upload')}>Upload Document</Button>
            </div>
          </Card>
        ) : viewMode === 'list' ? (
          <Card padding="none">
            <div className="divide-y divide-gray-100">
              {filtered.map((doc) => (
                <div key={doc.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 text-lg">
                    {CATEGORY_EMOJI[doc.category] ?? '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.category} &middot; {doc.size} &middot; {doc.date}
                    </p>
                  </div>
                  <div className="hidden sm:block text-xs text-gray-500 font-mono shrink-0">{doc.case}</div>
                  <div className="shrink-0">{statusBadge(doc.status)}</div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => navigate('/documents/viewer')}
                      className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                      title="Download"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((doc) => (
              <Card key={doc.id} padding="none" className="group cursor-pointer hover:border-indigo-200 transition-colors">
                <div className="p-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                    <Folder size={20} className="text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate mb-1">{doc.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{doc.size} &middot; {doc.date}</p>
                  {statusBadge(doc.status)}
                  <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate('/documents/viewer')}
                      className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
