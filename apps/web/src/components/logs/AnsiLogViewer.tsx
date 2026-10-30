'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Download,
  Search,
  Filter,
  Check,
  RotateCw,
  ArrowDown,
  WrapText,
  Copy,
} from 'lucide-react';

interface AnsiLogViewerProps {
  runId: string;
  initialLogs?: Array<{ timestamp: string; level: string; message: string }>;
}

export function AnsiLogViewer({ runId, initialLogs }: AnsiLogViewerProps) {
  const [logs, setLogs] = useState(
    initialLogs || [
      { timestamp: '17:40:01.102', level: 'INFO', message: `Initializing SJify Container Runner for Run ID: ${runId}` },
      { timestamp: '17:40:01.240', level: 'INFO', message: 'Pulling base image node:20-alpine (cached locally)' },
      { timestamp: '17:40:01.480', level: 'INFO', message: 'Allocating 1024MB RAM and 1.0 CPU cgroup quota' },
      { timestamp: '17:40:02.100', level: 'INFO', message: 'Injecting SJIFY_TOKEN and storage environment variables' },
      { timestamp: '17:40:02.350', level: 'INFO', message: 'Crawlee CheerioCrawler engine initialized with maxConcurrency: 5' },
      { timestamp: '17:40:03.010', level: 'DEBUG', message: 'Target domain robots.txt inspected: Allowed with rate-limiting' },
      { timestamp: '17:40:03.540', level: 'INFO', message: 'Fetching https://news.ycombinator.com (status: 200 OK, latency: 142ms)' },
      { timestamp: '17:40:04.220', level: 'INFO', message: 'Parsing CSS selectors: extracted 30 news items' },
      { timestamp: '17:40:05.100', level: 'INFO', message: 'Pushed 5 structured records to default Dataset' },
      { timestamp: '17:40:05.800', level: 'SUCCESS', message: 'Actor run finished with exit code 0 (SUCCEEDED)' },
    ]
  );

  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [wrapLines, setWrapLines] = useState(true);
  const [copied, setCopied] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const text = filteredLogs.map((l) => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${runId}-logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-[#080D15] border border-[#172233] overflow-hidden flex flex-col h-[520px]">
      {/* Log Header Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D131F] border-b border-[#1E2B40] text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white font-mono">Live Container Logs</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1 bg-[#080D15] p-1 rounded-lg border border-[#1E2B40]">
          {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                filterLevel === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="w-40 pl-7 pr-2 py-1 rounded bg-[#080D15] border border-[#1E2B40] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Toggles & Download */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
              autoScroll
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'text-slate-500 border-[#1E2B40] hover:text-white'
            }`}
            title="Auto-scroll"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWrapLines(!wrapLines)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
              wrapLines
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'text-slate-500 border-[#1E2B40] hover:text-white'
            }`}
            title="Wrap lines"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-[#080D15] hover:bg-[#162135] text-slate-400 hover:text-white border border-[#1E2B40]"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownloadLogs}
            className="p-1.5 rounded-lg bg-[#080D15] hover:bg-[#162135] text-slate-400 hover:text-white border border-[#1E2B40]"
            title="Download log file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className={`flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed ${
          wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
        }`}
      >
        {filteredLogs.map((log, index) => {
          const levelColor =
            log.level === 'ERROR'
              ? 'text-rose-400 bg-rose-500/10'
              : log.level === 'WARN'
              ? 'text-amber-400 bg-amber-500/10'
              : log.level === 'SUCCESS'
              ? 'text-emerald-400 bg-emerald-500/10'
              : log.level === 'DEBUG'
              ? 'text-slate-500'
              : 'text-cyan-400 bg-cyan-500/10';

          return (
            <div key={index} className="py-0.5 hover:bg-slate-900/60 px-1 rounded flex items-start gap-2.5">
              <span className="text-slate-600 select-none text-[11px] w-8 text-right shrink-0">
                {index + 1}
              </span>
              <span className="text-slate-500 text-[11px] shrink-0 font-mono">{log.timestamp}</span>
              <span className={`px-1.5 rounded text-[10px] uppercase font-bold shrink-0 ${levelColor}`}>
                {log.level}
              </span>
              <span className="text-slate-200">{log.message}</span>
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
