'use client';

import React from 'react';
import { Network, Webhook, FileSpreadsheet, Slack, ArrowRight, ShieldCheck } from 'lucide-react';

export default function IntegrationsPage() {
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
      name: 'Generic HTTP Webhook',
      desc: 'POST signed HMAC JSON payloads to your custom API endpoint on run events.',
      category: 'Webhooks',
      status: 'Configured (2)',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Integrations & Webhooks</h1>
        <p className="text-xs text-slate-400">
          Connect Actor runs and scraped datasets to your third-party SaaS tools and notification webhooks.
        </p>
      </div>

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
              <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
            </div>

            <button className="mt-5 pt-3 border-t border-[#172030] flex items-center justify-between text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Configure Integration <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
