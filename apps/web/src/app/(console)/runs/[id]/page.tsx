'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  PlayCircle,
  StopCircle,
  RefreshCw,
  RotateCcw,
  Download,
  Share2,
  Terminal,
  Database,
  Sliders,
  BarChart2,
  Cpu,
  Clock,
  Layers,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { AnsiLogViewer } from '@/components/logs/AnsiLogViewer';
import { DatasetViewer } from '@/components/storage/DatasetViewer';

export default function RunDetailPage() {
  const params = useParams();
  const runId = (params.id as string) || 'run_9f8a2c1b';

  const [activeTab, setActiveTab] = useState<'output' | 'log' | 'input' | 'storage' | 'metrics'>('output');
  const [runStatus, setRunStatus] = useState<'RUNNING' | 'SUCCEEDED' | 'ABORTED'>('SUCCEEDED');
  const [isAborting, setIsAborting] = useState(false);
  const [isResurrecting, setIsResurrecting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const runInfo = {
    id: runId,
    actor: 'sjify/website-content-crawler',
    task: 'Daily Documentation Indexer',
    origin: 'WEB',
    started: '10 mins ago',
    finished: '9 mins ago',
    duration: '42s',
    memoryAllocated: '1024 MB',
    cpuAllocated: '1.0 Core',
    resultsCount: 5,
    chargedUsage: '$0.012',
    exitCode: 0,
    containerId: 'sjify_ctr_a87f2b901',
    defaultDatasetId: 'ds_hacker_news_frontpage',
    defaultKvsId: 'kvs_run_state_9f8a',
    defaultQueueId: 'rq_crawl_urls_9f8a',
  };

  const handleAbort = () => {
    setIsAborting(true);
    setTimeout(() => {
      setRunStatus('ABORTED');
      setIsAborting(false);
    }, 1000);
  };

  const handleResurrect = () => {
    setIsResurrecting(true);
    setTimeout(() => {
      setRunStatus('RUNNING');
      setIsResurrecting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Run Status & Controls Banner */}
      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                runStatus === 'SUCCEEDED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : runStatus === 'RUNNING'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  runStatus === 'SUCCEEDED'
                    ? 'bg-emerald-400'
                    : runStatus === 'RUNNING'
                    ? 'bg-cyan-400'
                    : 'bg-rose-400'
                }`}
              />
              {runStatus}
            </span>
            <h1 className="text-xl font-display font-bold text-white">{runInfo.actor}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono mt-2">
            <span>Run ID: <strong className="text-white">{runId}</strong></span>
            <span>•</span>
            <span>Duration: <strong className="text-white">{runInfo.duration}</strong></span>
            <span>•</span>
            <span>RAM: <strong className="text-cyan-400">{runInfo.memoryAllocated}</strong></span>
            <span>•</span>
            <span>Cost: <strong className="text-emerald-400">{runInfo.chargedUsage}</strong></span>
            <span>•</span>
            <span>Results: <strong className="text-cyan-300">{runInfo.resultsCount} items</strong></span>
          </div>
        </div>

        {/* Action Controls: Abort, Resurrect, Reboot, Rerun, Export */}
        <div className="flex flex-wrap items-center gap-2">
          {runStatus === 'RUNNING' && (
            <button
              onClick={handleAbort}
              disabled={isAborting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              {isAborting ? 'Aborting...' : 'Abort Run'}
            </button>
          )}

          {runStatus !== 'RUNNING' && (
            <button
              onClick={handleResurrect}
              disabled={isResurrecting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-[#1A2538] text-slate-200 border border-[#1E2B40] text-xs font-semibold transition-colors"
              title="Revive finished run and continue container"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              {isResurrecting ? 'Resurrecting...' : 'Resurrect Run'}
            </button>
          )}

          <button
            onClick={() => alert('Container restarted without loss of state')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-[#1A2538] text-slate-200 border border-[#1E2B40] text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
            Reboot
          </button>

          <Link
            href={`/actors/website-content-crawler`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95"
          >
            <PlayCircle className="w-3.5 h-3.5 fill-current" />
            Rerun with New Input
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#172030] pb-1 overflow-x-auto">
        {[
          { key: 'output', label: 'Dataset Output', icon: Database },
          { key: 'log', label: 'Live Logs', icon: Terminal },
          { key: 'input', label: 'Run Input', icon: Sliders },
          { key: 'storage', label: 'Storages', icon: Layers },
          { key: 'metrics', label: 'Metrics & Graphs', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#111827]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dataset Output View (Table, JSON Tree, Gallery, Exporters) */}
      {activeTab === 'output' && (
        <DatasetViewer datasetId={runInfo.defaultDatasetId} datasetName="Hacker News Front Page Scrape" />
      )}

      {/* Tab 2: Live Log Streamer */}
      {activeTab === 'log' && (
        <AnsiLogViewer runId={runId} />
      )}

      {/* Tab 3: Run Input JSON */}
      {activeTab === 'input' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Input Payload Provided</h3>
            <span className="text-xs font-mono text-slate-400">application/json</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#080D15] border border-[#172233] text-xs font-mono text-cyan-300 overflow-x-auto">
{JSON.stringify(
  {
    startUrls: [{ url: 'https://news.ycombinator.com' }],
    maxPagesPerCrawl: 25,
    outputFormat: 'markdown',
    respectRobotsTxt: true,
    proxyConfiguration: {
      useApifyProxy: true,
      groups: ['RESIDENTIAL'],
    },
  },
  null,
  2
)}
          </pre>
        </div>
      )}

      {/* Tab 4: Storages Links */}
      {activeTab === 'storage' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 font-mono">Default Dataset</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-sm font-bold text-white">{runInfo.defaultDatasetId}</p>
            <p className="text-xs text-slate-400">Stores append-only structured items scraped by the Actor.</p>
            <Link
              href={`/storage?id=${runInfo.defaultDatasetId}`}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-2 font-semibold"
            >
              Open in Storage Browser <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-400 font-mono">Key-Value Store</span>
              <HardDrive className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-sm font-bold text-white">{runInfo.defaultKvsId}</p>
            <p className="text-xs text-slate-400">Contains runtime records: <code>INPUT</code> and <code>OUTPUT</code> blobs.</p>
            <Link
              href={`/storage?kvs=${runInfo.defaultKvsId}`}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-2 font-semibold"
            >
              Inspect Key-Value Records <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 font-mono">Request Queue</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-sm font-bold text-white">{runInfo.defaultQueueId}</p>
            <p className="text-xs text-slate-400">FIFO/LIFO crawling URL queue with deduplication locks.</p>
            <Link
              href={`/storage?queue=${runInfo.defaultQueueId}`}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-2 font-semibold"
            >
              View Queue State <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 5: Metrics & Performance Graphs */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              CPU Utilization Over Time
            </h3>
            <div className="h-44 rounded-xl bg-[#080D15] border border-[#172233] flex items-end justify-between p-4 gap-2">
              {[12, 28, 45, 68, 82, 64, 40, 22, 10].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                    style={{ height: `${val * 1.5}px` }}
                  />
                  <span className="text-[10px] text-slate-500 font-mono">{idx * 5}s</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Average: 41.2%</span>
              <span>Peak: 82%</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-teal-400" />
              RAM Consumption (MB)
            </h3>
            <div className="h-44 rounded-xl bg-[#080D15] border border-[#172233] flex items-end justify-between p-4 gap-2">
              {[210, 340, 480, 620, 780, 810, 750, 690, 640].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t"
                    style={{ height: `${(val / 1024) * 140}px` }}
                  />
                  <span className="text-[10px] text-slate-500 font-mono">{idx * 5}s</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Peak: 810 MB / 1024 MB</span>
              <span>Limit Headroom: 214 MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
