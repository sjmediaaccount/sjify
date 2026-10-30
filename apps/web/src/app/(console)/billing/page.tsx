'use client';

import React from 'react';
import { CreditCard, Check, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function BillingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'For hobbyists and individual exploration.',
      features: [
        '$5.00 monthly platform credit',
        'Up to 8 GB concurrent RAM',
        '7 days storage retention',
        'Community support',
      ],
      current: false,
    },
    {
      name: 'Starter',
      price: '$49',
      period: 'per month',
      desc: 'For growing scrapers and reliable recurring tasks.',
      features: [
        '$49 platform usage credit',
        'Up to 16 GB concurrent RAM',
        '14 days storage retention',
        'Standard residential proxies',
        'Email & Discord support',
      ],
      current: false,
    },
    {
      name: 'Scale',
      price: '$199',
      period: 'per month',
      desc: 'For production web crawling and heavy automation workloads.',
      features: [
        '$199 platform usage credit',
        'Up to 32 GB concurrent RAM',
        '30 days storage retention',
        'Priority residential proxy pools',
        'Streamable MCP server for AI agents',
        'Priority 24/7 support',
      ],
      current: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'annually',
      desc: 'Dedicated runner infrastructure, custom proxies, and SLA.',
      features: [
        'Dedicated compute nodes',
        'Unlimited concurrent RAM',
        'Custom proxy integration & IP whitelisting',
        'Dedicated account engineer',
        '99.9% uptime SLA',
      ],
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">Billing & Plans</h1>
        <p className="text-xs text-slate-400">
          Manage subscriptions, inspect compute usage, set monthly spending limits, and download invoices.
        </p>
      </div>

      {/* Current Spend Card */}
      <div className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">Active Plan: Scale</span>
          <h2 className="text-2xl font-display font-black text-white mt-1">$14.85 spent this cycle</h2>
          <p className="text-xs text-slate-400 mt-0.5">Monthly hard spending limit: $250.00 • Next reset: Nov 15, 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3.5 py-2 rounded-lg bg-[#111827] hover:bg-[#1A2538] text-slate-200 border border-[#1E2B40] text-xs font-semibold">
            Adjust Spending Limit
          </button>
          <button className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm">
            Manage Payment Method
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`p-5 rounded-2xl border flex flex-col justify-between ${
              p.current
                ? 'bg-gradient-to-b from-[#0F1E33] to-[#0A1220] border-cyan-500/50 shadow-glow-sm'
                : 'bg-[#0D131F] border-[#1A2538]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-base">{p.name}</h3>
                {p.current && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Current
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-display font-black text-white">{p.price}</span>
                <span className="text-xs text-slate-400 font-mono">/{p.period}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">{p.desc}</p>

              <div className="mt-5 space-y-2 border-t border-[#172030] pt-4">
                {p.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={p.current}
              className={`w-full mt-6 py-2 rounded-lg text-xs font-semibold transition-colors ${
                p.current
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-glow-sm'
              }`}
            >
              {p.current ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
