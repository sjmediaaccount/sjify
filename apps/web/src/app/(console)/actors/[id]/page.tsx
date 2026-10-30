'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Box,
  Play,
  Code2,
  Hammer,
  Sliders,
  History,
  Settings,
  Share2,
  Terminal,
  FileText,
  DollarSign,
  Plus,
  Check,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { ActorStudio } from '@/components/studio/ActorStudio';
import { DynamicInputForm } from '@/components/input-schema/DynamicInputForm';

export default function ActorStudioPage() {
  const params = useParams();
  const actorId = (params.id as string) || 'website-content-crawler';

  const [activeTab, setActiveTab] = useState<'source' | 'input' | 'builds' | 'runs' | 'publication' | 'settings' | 'api'>('source');

  // Settings tab state
  const [memoryMb, setMemoryMb] = useState(1024);
  const [timeoutSecs, setTimeoutSecs] = useState(3600);
  const [restartPolicy, setRestartPolicy] = useState('NEVER');
  const [envVars, setEnvVars] = useState([
    { key: 'NODE_ENV', value: 'production', isSecret: false },
    { key: 'LOG_LEVEL', value: 'INFO', isSecret: false },
  ]);

  const actor = {
    id: actorId,
    name: 'Website Content Crawler',
    slug: 'website-content-crawler',
    username: 'sjify',
    version: '1.0.0 (latest)',
    description: 'Recursively crawls websites, renders client-side JavaScript, and extracts clean markdown for LLMs.',
  };

  const builds = [
    {
      buildNumber: 4,
      tag: 'latest',
      status: 'READY',
      started: '1 hour ago',
      duration: '45s',
      commit: 'feat: add stealth fingerprint randomization',
    },
    {
      buildNumber: 3,
      tag: '1.0.0',
      status: 'READY',
      started: '1 day ago',
      duration: '52s',
      commit: 'chore: upgrade Crawlee to 3.11',
    },
    {
      buildNumber: 2,
      tag: 'beta',
      status: 'FAILED',
      started: '3 days ago',
      duration: '18s',
      commit: 'test: experimental chromium flags',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Actor Header Strip */}
      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{actor.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {actor.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{actor.username}/{actor.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('input')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Run
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#172030] overflow-x-auto pb-1">
        {[
          { key: 'source', label: 'Source (Studio)', icon: Code2 },
          { key: 'input', label: 'Input Form', icon: Sliders },
          { key: 'builds', label: 'Builds & Docker', icon: Hammer },
          { key: 'runs', label: 'Run History', icon: History },
          { key: 'publication', label: 'Store Listing', icon: DollarSign },
          { key: 'settings', label: 'Settings & Secrets', icon: Settings },
          { key: 'api', label: 'API & Integrations', icon: Terminal },
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

      {/* TAB 1: Source (Monaco Web Studio) */}
      {activeTab === 'source' && (
        <ActorStudio actorId={actorId} actorName={actor.name} />
      )}

      {/* TAB 2: Dynamic Input Form */}
      {activeTab === 'input' && (
        <DynamicInputForm actorId={actorId} />
      )}

      {/* TAB 3: Builds Pipeline */}
      {activeTab === 'builds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Docker Build History</h3>
            <button
              onClick={() => alert('Triggering new Docker image build from latest commit...')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm"
            >
              <Hammer className="w-3.5 h-3.5" />
              Trigger Build
            </button>
          </div>

          <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080D15] text-slate-400 uppercase font-mono text-[11px] border-b border-[#172030]">
                <tr>
                  <th className="px-4 py-3">Build #</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Triggered</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Commit Message</th>
                  <th className="px-4 py-3 text-right">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172030] text-slate-300">
                {builds.map((b) => (
                  <tr key={b.buildNumber} className="hover:bg-[#111827]/60">
                    <td className="px-4 py-3 font-mono font-bold text-white">#{b.buildNumber}</td>
                    <td className="px-4 py-3 font-mono text-cyan-400">{b.tag}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          b.status === 'READY'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{b.started}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{b.duration}</td>
                    <td className="px-4 py-3 text-slate-300">{b.commit}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Build logs for #${b.buildNumber}: Ready and tagged as ${b.tag}`)}
                        className="px-2 py-1 rounded bg-[#111827] text-slate-300 hover:text-white border border-[#1E2B40] text-xs font-mono"
                      >
                        View Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Run History */}
      {activeTab === 'runs' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel text-center py-12 space-y-3">
          <p className="text-sm font-semibold text-white">Execution Runs for {actor.name}</p>
          <p className="text-xs text-slate-400">18,450 historical executions recorded.</p>
          <Link
            href="/runs"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold"
          >
            Open All Runs Table <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* TAB 5: Publication & Store Listing */}
      {activeTab === 'publication' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-5 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white">Store Publication & Monetization</h3>
            <p className="text-xs text-slate-400">Publish this Actor to the SJify Store to monetize your scrapers.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Pricing Model</label>
              <select className="w-full px-3 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white">
                <option value="FREE">Free (Standard compute billing)</option>
                <option value="RENTAL">Monthly Rental Subscription ($19.99/mo)</option>
                <option value="PAY_PER_RESULT">Pay-per-result ($0.002 / record)</option>
                <option value="PAY_PER_EVENT">Pay-per-event ($0.01 / run)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Store Visibility</label>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="vis" defaultChecked className="accent-cyan-400" />
                  Public (Listed in SJify Store)
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="vis" className="accent-cyan-400" />
                  Private (Only your team)
                </label>
              </div>
            </div>

            <button
              onClick={() => alert('Actor publication settings updated!')}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-sm"
            >
              Save Publication Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: Settings, Memory & Secrets */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white">Container Runtime Settings</h3>
            <p className="text-xs text-slate-400">Configure default memory quotas, timeout constraints, and environment secrets.</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>Default Allocated Memory</span>
                <span className="font-mono text-cyan-400">{memoryMb} MB</span>
              </div>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={memoryMb}
                onChange={(e) => setMemoryMb(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Timeout (seconds)</label>
              <input
                type="number"
                value={timeoutSecs}
                onChange={(e) => setTimeoutSecs(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs text-white font-mono"
              />
            </div>

            <div className="pt-2 border-t border-[#172030]">
              <h4 className="text-xs font-semibold text-slate-200 mb-2">Environment Variables & Secrets</h4>
              <div className="space-y-2">
                {envVars.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-xs">
                    <input
                      type="text"
                      value={v.key}
                      readOnly
                      className="w-1/3 px-3 py-1.5 rounded-lg bg-[#080D15] border border-[#1A2538] text-cyan-400"
                    />
                    <input
                      type="text"
                      value={v.value}
                      readOnly
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#080D15] border border-[#1A2538] text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert('Actor settings updated!')}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-sm"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: API & SDK Snippets */}
      {activeTab === 'api' && (
        <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white font-sans">API Endpoint & SDK Usage</h3>
          <p className="text-xs text-slate-400 font-sans">Trigger this Actor programmatically or via AI agent tool call.</p>

          <div className="p-4 rounded-xl bg-[#080D15] border border-[#172233] text-cyan-300 space-y-2 overflow-x-auto">
            <p className="text-slate-400"># Direct synchronous execution (waits for dataset results)</p>
            <p>POST http://localhost:4000/v1/acts/{actor.slug}/run-sync-get-dataset-items</p>
            <p>Authorization: Bearer &lt;SJIFY_API_TOKEN&gt;</p>
          </div>
        </div>
      )}
    </div>
  );
}
