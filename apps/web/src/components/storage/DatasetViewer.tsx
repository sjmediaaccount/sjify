'use client';

import React, { useState } from 'react';
import {
  Table,
  Code,
  Image as ImageIcon,
  Download,
  Filter,
  Search,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileCode,
  Share2,
} from 'lucide-react';

interface DatasetViewerProps {
  datasetId: string;
  datasetName?: string;
  initialItems?: Array<Record<string, any>>;
}

export function DatasetViewer({
  datasetId,
  datasetName = 'Scraped Dataset Output',
  initialItems = [
    {
      rank: 1,
      title: 'Show HN: SJify – Open Containerized Scraping Platform',
      url: 'https://sjify.com',
      domain: 'sjify.com',
      points: 482,
      author: 'sj_admin',
      comments: 114,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      scrapedAt: '2026-10-30T17:40:00Z',
    },
    {
      rank: 2,
      title: 'Crawlee 4.0 Released with Deep Playwright Stealth',
      url: 'https://crawlee.dev',
      domain: 'crawlee.dev',
      points: 395,
      author: 'apify_fan',
      comments: 87,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
      scrapedAt: '2026-10-30T17:40:05Z',
    },
    {
      rank: 3,
      title: 'Building Streamable Model Context Protocol (MCP) Servers',
      url: 'https://modelcontextprotocol.io',
      domain: 'modelcontextprotocol.io',
      points: 320,
      author: 'ai_engineer',
      comments: 62,
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
      scrapedAt: '2026-10-30T17:40:12Z',
    },
    {
      rank: 4,
      title: 'Reverse Engineering Anti-Bot Fingerprint Evasion',
      url: 'https://example.org/fingerprinting',
      domain: 'example.org',
      points: 275,
      author: 'stealth_dev',
      comments: 49,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
      scrapedAt: '2026-10-30T17:40:18Z',
    },
    {
      rank: 5,
      title: 'PostgreSQL vs SQLite for High-Concurrency Worker Leases',
      url: 'https://example.com/databases',
      domain: 'example.com',
      points: 198,
      author: 'db_architect',
      comments: 54,
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
      scrapedAt: '2026-10-30T17:40:22Z',
    },
  ],
}: DatasetViewerProps) {
  const [viewMode, setViewMode] = useState<'table' | 'json' | 'gallery'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('JSON');
  const [includeFields, setIncludeFields] = useState<string[]>([]);

  const items = initialItems;
  const columns = items.length > 0 ? Object.keys(items[0]) : [];

  const filteredItems = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (format: string) => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `${datasetId}.${format.toLowerCase()}`;

    if (format === 'JSON') {
      content = JSON.stringify(filteredItems, null, 2);
      mimeType = 'application/json';
    } else if (format === 'JSONL') {
      content = filteredItems.map((i) => JSON.stringify(i)).join('\n');
      mimeType = 'application/x-ndjson';
    } else if (format === 'CSV') {
      const headers = columns.join(',');
      const rows = filteredItems.map((item) =>
        columns
          .map((c) => {
            const val = item[c] !== undefined ? String(item[c]).replace(/"/g, '""') : '';
            return `"${val}"`;
          })
          .join(',')
      );
      content = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
    } else if (format === 'XML') {
      content = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset id="${datasetId}">\n${filteredItems
        .map(
          (item) =>
            `  <item>\n${columns
              .map((c) => `    <${c}>${String(item[c]).replace(/&/g, '&amp;')}</${c}>`)
              .join('\n')}\n  </item>`
        )
        .join('\n')}\n</dataset>`;
      mimeType = 'application/xml';
    } else if (format === 'HTML') {
      content = `<!DOCTYPE html><html><head><title>${datasetName}</title><style>table{border-collapse:collapse;width:100%;font-family:sans-serif;}th,td{border:1px solid #ddd;padding:8px;}th{background:#f2f2f2;}</style></head><body><h2>${datasetName}</h2><table><tr>${columns
        .map((c) => `<th>${c}</th>`)
        .join('')}</tr>${filteredItems
        .map(
          (item) =>
            `<tr>${columns.map((c) => `<td>${String(item[c] || '')}</td>`).join('')}</tr>`
        )
        .join('')}</table></body></html>`;
      mimeType = 'text/html';
    } else if (format === 'RSS') {
      content = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${datasetName}</title><link>http://localhost:4000/v1/datasets/${datasetId}</link><description>SJify dataset RSS feed</description>${filteredItems
        .map(
          (item) =>
            `<item><title>${item.title || 'Item'}</title><link>${item.url || ''}</link><description>${item.title || ''}</description></item>`
        )
        .join('')}</channel></rss>`;
      mimeType = 'application/rss+xml';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

  const copyApiUrl = () => {
    const url = `http://localhost:4000/v1/datasets/${datasetId}/items`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#080D15] border border-[#172233]">
        {/* Left: View Mode Switcher (Table / JSON / Gallery) */}
        <div className="flex items-center gap-1.5 bg-[#0D131F] p-1 rounded-lg border border-[#1E2B40]">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'json'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            JSON
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'gallery'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Gallery
          </button>
        </div>

        {/* Center: Search / Filter input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items or fields..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0D131F] border border-[#1E2B40] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Right: Export & API Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyApiUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D131F] hover:bg-[#162135] text-slate-300 hover:text-white border border-[#1E2B40] text-xs font-mono transition-colors"
            title="Copy direct API endpoint to items"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            {copiedLink ? 'Copied API URL' : 'API Endpoint'}
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm hover:opacity-95 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            Export ({filteredItems.length})
          </button>
        </div>
      </div>

      {/* 1. TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-xl bg-[#080D15] border border-[#172233] overflow-hidden">
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-[#0D131F] text-slate-400 uppercase font-mono text-[11px] border-b border-[#1E2B40]">
                <tr>
                  <th className="px-4 py-2.5 w-12 text-center text-slate-500">#</th>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-2.5 font-semibold text-slate-300 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172233] text-slate-300">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#111827]/60 transition-colors">
                    <td className="px-4 py-2 text-center text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                    {columns.map((col) => {
                      const val = item[col];
                      const isUrl = typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'));
                      const isImage = isUrl && (val.includes('.jpg') || val.includes('.png') || val.includes('unsplash') || val.includes('.webp'));

                      return (
                        <td key={col} className="px-4 py-2 max-w-xs truncate">
                          {isImage ? (
                            <img src={val} alt="scraped" className="w-8 h-8 rounded object-cover border border-[#1E2B40]" />
                          ) : isUrl ? (
                            <a href={val} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                              <span className="truncate">{val}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : typeof val === 'object' && val !== null ? (
                            <span className="font-mono text-purple-400">{JSON.stringify(val)}</span>
                          ) : typeof val === 'number' ? (
                            <span className="font-mono text-emerald-400">{val}</span>
                          ) : (
                            <span>{String(val ?? '')}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-3 border-t border-[#172233] bg-[#0D131F] text-xs text-slate-400 font-mono">
            <span>Showing {filteredItems.length} of {items.length} items</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 rounded bg-[#111827] text-slate-500 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">Page 1 of 1</span>
              <button disabled className="p-1 rounded bg-[#111827] text-slate-500 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. JSON TREE VIEW */}
      {viewMode === 'json' && (
        <div className="rounded-xl bg-[#080D15] border border-[#172233] p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-cyan-300">
          <pre className="whitespace-pre-wrap">{JSON.stringify(filteredItems, null, 2)}</pre>
        </div>
      )}

      {/* 3. GALLERY VIEW */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#080D15] border border-[#172233] glass-panel-hover space-y-2">
              {item.image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1E2B40] bg-slate-900">
                  <img src={item.image} alt={item.title || 'Item image'} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-cyan-300">
                    Rank #{item.rank || idx + 1}
                  </span>
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-slate-900/80 flex items-center justify-center text-slate-600 border border-[#1E2B40]">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <h4 className="font-semibold text-white text-xs line-clamp-2">{item.title || 'Item'}</h4>
              <p className="text-[11px] text-slate-400 font-mono truncate">{item.domain || item.url}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-[#172233]">
                <span className="text-emerald-400 font-mono">{item.points ? `${item.points} pts` : ''}</span>
                <span className="text-slate-400 font-mono">{item.comments ? `${item.comments} comments` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MULTI-FORMAT EXPORT MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D131F] border border-[#1E2B40] rounded-2xl p-6 shadow-2xl glass-panel space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Export Dataset Items
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select your desired file format for instant download.</p>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            {/* Formats Grid */}
            <div className="grid grid-cols-3 gap-2">
              {['JSON', 'JSONL', 'CSV', 'XML', 'HTML', 'RSS'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedFormat === fmt
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow-sm font-bold'
                      : 'bg-[#080D15] border-[#172233] text-slate-300 hover:border-slate-600 font-medium'
                  } text-xs font-mono`}
                >
                  .{fmt.toLowerCase()}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#080D15] border border-[#172233] text-xs space-y-1">
              <span className="font-semibold text-slate-300 font-mono">Export Summary:</span>
              <p className="text-slate-400">Exporting {filteredItems.length} records in <strong>{selectedFormat}</strong> format.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1E2B40]">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-[#1A2538] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExport(selectedFormat)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black text-xs font-bold shadow-glow-sm hover:opacity-95"
              >
                Download .{selectedFormat.toLowerCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
