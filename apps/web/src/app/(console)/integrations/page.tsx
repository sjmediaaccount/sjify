'use client';

import React, { useState } from 'react';
import {
  Network,
  Webhook,
  FileSpreadsheet,
  Slack,
  ArrowRight,
  Plus,
  Copy,
  Check,
  Send,
  Trash2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function IntegrationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.site/demo-endpoint');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'ACTOR.RUN.SUCCEEDED',
    'ACTOR.RUN.FAILED',
  ]);
  const [payloadTemplate, setPayloadTemplate] = useState(
    JSON.stringify(
      {
        event: '{{eventType}}',
        runId: '{{runId}}',
        actorId: '{{actorId}}',
        status: '{{status}}',
        datasetId: '{{defaultDatasetId}}',
        resultsCount: '{{resultsCount}}',
      },
      null,
      2
    )
  );
  const [testSent, setTestSent] = useState(false);

  const webhooksList = [
    {
      id: 'wh_1',
      name: 'Production Slack Notification Dispatcher',
      url: 'https://hooks.slack.com/services/T00/B00/XXXX',
      events: ['ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED'],
      lastStatus: '200 OK (142ms)',
      status: 'Active',
    },
    {
      id: 'wh_2',
      name: 'Zapier Dataset Webhook Trigger',
      url: 'https://hooks.zapier.com/hooks/catch/12345/abcde/',
      events: ['ACTOR.RUN.SUCCEEDED'],
      lastStatus: '200 OK (98ms)',
      status: 'Active',
    },
  ];

  const handleTestDispatch = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const connectors = [
    {
      name: 'Google Sheets',
      desc: 'Append scraped dataset rows automatically to any Google Sheet spreadsheet.',
      category: 'Data Export',
      status: 'Connected',
    },
    {
      name: 'Slack Alerts',
      desc: 'Send real-time alerts to a Slack channel when an Actor run succeeds or fails.',
      category: 'Notifications',
      status: 'Ready',
    },
    {
      name: 'Zapier & Make',
      desc: 'Trigger workflows across 5,000+ cloud apps when new dataset items arrive.',
      category: 'Automation',
      status: 'Ready',
    },
    {
      name: 'n8n Workflow Connector',
      desc: 'Self-hosted automation triggers and nodes for SJify platform actions.',
      category: 'Self-Hosted',
      status: 'Ready',
    },
    {
      name: 'Airbyte / Keboola',
      desc: 'High-throughput data ingestion pipelines into Snowflake, BigQuery, or PostgreSQL.',
      category: 'Warehouse ELT',
      status: 'Ready',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">Integrations & Webhooks</h1>
          <p className="text-xs text-slate-400">
            Trigger HTTP callbacks on Actor lifecycle events and sync scraped datasets to third-party SaaS services.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm hover:opacity-95"
        >
          <Plus className="w-4 h-4" />
          Create Webhook
        </button>
      </div>

      {/* Webhooks Section */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] overflow-hidden glass-panel">
        <div className="p-4 border-b border-[#172030] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Active Webhook Subscriptions</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">{webhooksList.length} endpoints</span>
        </div>

        <div className="divide-y divide-[#172030]">
          {webhooksList.map((wh) => (
            <div key={wh.id} className="p-4 flex items-center justify-between hover:bg-[#111827]/40">
              <div>
                <p className="text-sm font-semibold text-white">{wh.name}</p>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">{wh.url}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                  <span>Triggers: {wh.events.join(', ')}</span>
                  <span>•</span>
                  <span>Last status: <strong className="text-emerald-400">{wh.lastStatus}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestDispatch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1A2538] text-slate-300 text-xs font-mono border border-[#1E2B40]"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  Test Dispatch
                </button>
                <button className="p-1.5 rounded-lg bg-[#111827] text-rose-400 hover:bg-rose-500/10 border border-[#1E2B40]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connectors Section */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Pre-Built Cloud Connectors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.map((c) => (
            <div
              key={c.name}
              className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {c.category}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">{c.status}</span>
                </div>
                <h3 className="font-semibold text-white text-base mt-3">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.desc}</p>
              </div>

              <button className="mt-5 pt-3 border-t border-[#172030] flex items-center justify-between text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                Configure Connector <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE WEBHOOK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0D131F] border border-[#1E2B40] rounded-2xl p-6 shadow-2xl glass-panel space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-cyan-400" />
                  Create Outbound Webhook
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Dispatches HTTP POST notifications with HMAC signatures.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Target Endpoint URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">Lifecycle Event Triggers</label>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                  {['ACTOR.RUN.CREATED', 'ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED', 'ACTOR.RUN.TIMED_OUT', 'ACTOR.RUN.ABORTED'].map((evt) => (
                    <label key={evt} className="flex items-center gap-2 p-2 rounded-lg bg-[#080D15] border border-[#172233]">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(evt)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedEvents([...selectedEvents, evt]);
                          else setSelectedEvents(selectedEvents.filter((x) => x !== evt));
                        }}
                        className="accent-cyan-400"
                      />
                      <span className="truncate">{evt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Payload Template (Interpolated Variables)</label>
                <textarea
                  value={payloadTemplate}
                  onChange={(e) => setPayloadTemplate(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl bg-[#080D15] border border-[#1A2538] text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1E2B40]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#111827] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Webhook registered successfully!');
                  setIsModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black text-xs font-bold shadow-glow-sm"
              >
                Save Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
