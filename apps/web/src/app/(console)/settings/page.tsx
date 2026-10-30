'use client';

import React, { useState } from 'react';
import { Key, Shield, User, Building, Copy, Check, Plus, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const tokens = [
    {
      id: 'tok_dev',
      name: 'Development CLI & MCP Key',
      prefix: 'sjify_api_dev_...cdef',
      scopes: ['*'],
      created: 'Today',
      lastUsed: 'Just now',
    },
    {
      id: 'tok_ci',
      name: 'GitHub Actions CI Key',
      prefix: 'sjify_api_ci_...9a12',
      scopes: ['actors:read', 'actors:run'],
      created: '3 days ago',
      lastUsed: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400">
          Configure API tokens, team organizations, security preferences, and account profile.
        </p>
      </div>

      {/* API Tokens Section */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] p-5 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Personal & Organization API Tokens</h2>
              <p className="text-xs text-slate-400">Bearer tokens used by the SJify CLI, Python/JS SDKs, and MCP servers.</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm">
            <Plus className="w-3.5 h-3.5" />
            Generate New Token
          </button>
        </div>

        <div className="divide-y divide-[#172030] border-t border-[#172030] pt-2">
          {tokens.map((token) => (
            <div key={token.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{token.name}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                  <span className="text-cyan-400">{token.prefix}</span>
                  <span>•</span>
                  <span>Scopes: {token.scopes.join(', ')}</span>
                  <span>•</span>
                  <span>Last used: {token.lastUsed}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('sjify_api_dev_token_secret_1234567890abcdef');
                    setCopiedToken(token.id);
                    setTimeout(() => setCopiedToken(null), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-[#111827] text-slate-400 hover:text-white border border-[#1E2B40]"
                  title="Copy token"
                >
                  {copiedToken === token.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button className="p-1.5 rounded-lg bg-[#111827] text-rose-400 hover:text-rose-300 border border-[#1E2B40]" title="Revoke token">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Members Section */}
      <div className="rounded-2xl bg-[#0D131F] border border-[#1A2538] p-5 glass-panel space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Organization: SJify Core Team</h2>
            <p className="text-xs text-slate-400">Manage team seats and role permissions.</p>
          </div>
        </div>

        <div className="divide-y divide-[#172030] border-t border-[#172030] pt-2 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">SJify Administrator</p>
              <p className="text-slate-400 font-mono">admin@sjify.io</p>
            </div>
            <span className="font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              OWNER
            </span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Alex Rivera</p>
              <p className="text-slate-400 font-mono">developer@sjify.io</p>
            </div>
            <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              DEVELOPER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
