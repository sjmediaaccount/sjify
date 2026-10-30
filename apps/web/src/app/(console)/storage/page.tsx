'use client';

import React, { useState } from 'react';
import {
  Database,
  FileText,
  Layers,
  Download,
  ExternalLink,
  HardDrive,
  Plus,
  Eye,
  Trash2,
  Share2,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { DatasetViewer } from '@/components/storage/DatasetViewer';

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState<'datasets' | 'keyvalue' | 'queues'>('datasets');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

  const datasets = [
    {
      id: 'ds_hacker_news_frontpage',
      name: 'Hacker News Front Page Scrape',
      itemCount: 5,
      size: '4.2 KB',
      retention: '14 days',
      updated: '10 mins ago',
    },
    {
      id: 'ds_google_serp_ai',
      name: 'Google SERP Rankings (AI Queries)',
      itemCount: 30,
      size: '18.6 KB',
      retention: '7 days',
      updated: '1 hour ago',
    },
    {
      id: 'ds_ecommerce_prices',
      name: 'Daily Competitor Price Index',
      itemCount: 142,
      size: '64.8 KB',
      retention: '30 days',
      updated: '3 hours ago',
    },
  ];

  const keyValueStores = [
    {
      id: 'kvs_run_state_9f8a',
      name: 'Run State Store',
      recordCount: 2,
      records: [
        { key: 'INPUT', type: 'application/json', size: '342 B', public: false },
        { key: 'OUTPUT', type: 'application/json', size: '4.2 KB', public: true },
      ],
      updated: '10 mins ago',
    },
    {
      id: 'kvs_screenshots_store',
      name: 'Page Screenshots Store',
      recordCount: 12,
      records: [
        { key: 'screenshot-page-1.png', type: 'image/png', size: '245 KB', public: true },
        { key: 'screenshot-page-2.png', type: 'image/png', size: '312 KB', public: true },
      ],
      updated: 'Yesterday',
    },
  ];

  const requestQueues = [
    {
      id: 'rq_crawl_urls_9f8a',
      name: 'Crawl URL Frontier Queue',
      total: 125,
      handled: 120,
      pending: 5,
      updated: '10 mins ago',
    },
    {
      id: 'rq_sitemap_traversal',
      name: 'Sitemap Traversal Queue',
      total: 500,
      handled: 485,
      pending: 15,
      updated: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Storage Subsystem</h1>
          <p className="text-xs text-slate-400">
            High-performance append-only datasets, key-value record stores, and crawling request queues.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#172030] pb-2">
        <button
          onClick={() => {
            setActiveTab('datasets');
            setSelectedDatasetId(null);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'datasets'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          Datasets (Append-Only)
        </button>
        <button
          onClick={() => {
            setActiveTab('keyvalue');
            setSelectedDatasetId(null);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'keyvalue'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Key-Value Stores
        </button>
        <button
          onClick={() => {
            setActiveTab('queues');
            setSelectedDatasetId(null);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'queues'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Request Queues
        </button>
      </div>

      {/* If a dataset is selected for deep inspection */}
      {selectedDatasetId ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDatasetId(null)}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              ← Back to all datasets
            </button>
            <span className="text-xs text-slate-400 font-mono">Dataset ID: {selectedDatasetId}</span>
          </div>
          <DatasetViewer datasetId={selectedDatasetId} datasetName="Selected Dataset Records" />
        </div>
      ) : (
        <>
          {/* TAB 1: DATASETS */}
          {activeTab === 'datasets' && (
            <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080D15] text-slate-400 uppercase font-mono text-[11px] border-b border-[#172030]">
                  <tr>
                    <th className="px-4 py-3">Dataset ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Items Count</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Retention</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172030] text-slate-300">
                  {datasets.map((d) => (
                    <tr key={d.id} className="hover:bg-[#111827]/60">
                      <td className="px-4 py-3 font-mono text-cyan-400">{d.id}</td>
                      <td className="px-4 py-3 font-semibold text-white">{d.name}</td>
                      <td className="px-4 py-3 font-mono text-cyan-300">{d.itemCount} records</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{d.size}</td>
                      <td className="px-4 py-3 text-slate-400">{d.retention}</td>
                      <td className="px-4 py-3 text-slate-400">{d.updated}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedDatasetId(d.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect Data
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: KEY-VALUE STORES */}
          {activeTab === 'keyvalue' && (
            <div className="space-y-4">
              {keyValueStores.map((kvs) => (
                <div key={kvs.id} className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-teal-400" />
                        {kvs.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{kvs.id}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{kvs.recordCount} records</span>
                  </div>

                  <div className="rounded-xl bg-[#080D15] border border-[#172233] divide-y divide-[#172233]">
                    {kvs.records.map((r) => (
                      <div key={r.key} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-cyan-300">{r.key}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{r.type}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{r.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`Direct link to record: http://localhost:4000/v1/key-value-stores/${kvs.id}/records/${r.key}`)}
                            className="px-2.5 py-1 rounded bg-[#111827] hover:bg-[#1A2538] text-slate-300 font-mono text-[11px] border border-[#1E2B40]"
                          >
                            Get Record
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REQUEST QUEUES */}
          {activeTab === 'queues' && (
            <div className="space-y-4">
              {requestQueues.map((rq) => {
                const percent = Math.round((rq.handled / rq.total) * 100);
                return (
                  <div key={rq.id} className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-purple-400" />
                          {rq.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{rq.id}</p>
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-semibold">
                        {percent}% Crawled
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#172030] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center pt-2">
                      <div className="p-2.5 rounded-xl bg-[#080D15] border border-[#172233]">
                        <p className="text-[10px] text-slate-500 uppercase font-mono">Total Requests</p>
                        <p className="text-base font-bold text-white mt-0.5">{rq.total}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#080D15] border border-[#172233]">
                        <p className="text-[10px] text-slate-500 uppercase font-mono">Handled</p>
                        <p className="text-base font-bold text-emerald-400 mt-0.5">{rq.handled}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#080D15] border border-[#172233]">
                        <p className="text-[10px] text-slate-500 uppercase font-mono">Pending</p>
                        <p className="text-base font-bold text-amber-400 mt-0.5">{rq.pending}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
