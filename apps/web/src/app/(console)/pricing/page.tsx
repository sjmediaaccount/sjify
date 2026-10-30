'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Check,
  Zap,
  Sliders,
  ShieldCheck,
  Cpu,
  Globe,
  Database,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export default function PricingPage() {
  const [pagesPerMonth, setPagesPerMonth] = useState(100000);
  const [proxyGb, setProxyGb] = useState(15);
  const [concurrentRuns, setConcurrentRuns] = useState(16);

  // Compute estimate
  // Estimate ~0.00015 CUs per page on average with headless browser = 15 CUs per 100k pages
  // Residential proxy ~ $7-8 per GB
  const estimatedCuCost = (pagesPerMonth / 10000) * 1.5 * 0.2;
  const estimatedProxyCost = proxyGb * 7.5;
  const totalEstimatedCost = Math.round(estimatedCuCost + estimatedProxyCost);

  let recommendedPlan = 'Starter ($29/mo)';
  if (totalEstimatedCost <= 5) recommendedPlan = 'Free ($0/mo)';
  else if (totalEstimatedCost <= 49) recommendedPlan = 'Starter ($29/mo)';
  else if (totalEstimatedCost <= 250) recommendedPlan = 'Scale ($199/mo)';
  else if (totalEstimatedCost <= 1200) recommendedPlan = 'Business ($999/mo)';
  else recommendedPlan = 'Enterprise (Custom)';

  const comparisonFeatures = [
    {
      feature: 'Prepaid Usage Included',
      free: '$5.00 / month',
      starter: '$29.00 / month',
      scale: '$199.00 / month',
      business: '$999.00 / month',
      enterprise: 'Tailored',
    },
    {
      feature: 'Compute Unit (CU) Rate',
      free: '$0.25 / CU',
      starter: '$0.20 / CU',
      scale: '$0.16 / CU',
      business: '$0.13 / CU',
      enterprise: 'Custom rate',
    },
    {
      feature: 'Concurrent Actor RAM Limit',
      free: '8 GB',
      starter: '64 GB',
      scale: '256 GB',
      business: '512 GB',
      enterprise: 'Unlimited dedicated',
    },
    {
      feature: 'Max Concurrent Runs',
      free: '8 runs',
      starter: '32 runs',
      scale: '128 runs',
      business: '256 runs',
      enterprise: 'Unlimited custom',
    },
    {
      feature: 'Max Run Timeout',
      free: '2.5 hours',
      starter: '24 hours',
      scale: '7 days',
      business: '21 days',
      enterprise: 'Infinite runs',
    },
    {
      feature: 'Storage Retention Window',
      free: '7 days',
      starter: '14 days',
      scale: '30 days',
      business: '60 days',
      enterprise: 'Permanent / Custom',
    },
    {
      feature: 'Smart Proxy Network',
      free: 'Shared Datacenter',
      starter: 'Residential (Standard)',
      scale: 'Priority Residential + Geo',
      business: 'Global Residential + Dedicated',
      enterprise: 'Dedicated IP pools & Whitelist',
    },
    {
      feature: 'AI Model Context Protocol (MCP)',
      free: 'Yes',
      starter: 'Yes',
      scale: 'Yes (High Throughput)',
      business: 'Yes (Unlimited)',
      enterprise: 'Dedicated MCP Gateway',
    },
    {
      feature: 'Support Level',
      free: 'Community Discord',
      starter: 'Email Support',
      scale: 'Priority Chat Support',
      business: 'Dedicated Account Manager',
      enterprise: '24/7 Phone, TAM & SLA',
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl pb-12">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Flexible Plans & Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
          Transparent, Usage-Based Platform Pricing
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Start for free without a credit card. Upgrade whenever you need higher concurrency, larger proxy quotas, or priority support.
        </p>
      </div>

      {/* Interactive Usage Estimator Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F1728] to-[#0A0F1A] border border-cyan-500/30 glass-panel space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2538] pb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Interactive Usage Cost Estimator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust your expected scraping workload to see the recommended plan and estimated monthly spend.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#080D15] border border-cyan-500/30 text-right">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Recommended Plan</span>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              {recommendedPlan}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Pages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Pages Scraped Monthly</span>
              <span className="text-xs font-bold font-mono text-cyan-400">
                {pagesPerMonth.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={pagesPerMonth}
              onChange={(e) => setPagesPerMonth(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Includes DOM parsing & data extraction</p>
          </div>

          {/* Slider 2: Proxy GB */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Residential Proxy Traffic</span>
              <span className="text-xs font-bold font-mono text-teal-400">{proxyGb} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              step="1"
              value={proxyGb}
              onChange={(e) => setProxyGb(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Rotating residential IP bandwidth</p>
          </div>

          {/* Slider 3: Concurrency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Concurrent Run Jobs</span>
              <span className="text-xs font-bold font-mono text-purple-400">{concurrentRuns} parallel</span>
            </div>
            <input
              type="range"
              min="2"
              max="64"
              step="2"
              value={concurrentRuns}
              onChange={(e) => setConcurrentRuns(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Simultaneous container runs</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1A2538] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Estimated consumption: ~<strong className="text-white">${totalEstimatedCost}</strong> per month
            (Calculated using Crawlee headless browser averages).
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95"
          >
            <span>Activate {recommendedPlan.split(' ')[0]} Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Side-by-Side Detailed Comparison Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Full Tier Feature Matrix</h2>

        <div className="rounded-2xl border border-[#1A2538] bg-[#0D131F] overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1A2538] bg-[#0A0E17] text-slate-400 font-mono">
                <th className="p-4 font-semibold">Features & Quotas</th>
                <th className="p-4 font-semibold text-white">Free</th>
                <th className="p-4 font-semibold text-white">Starter</th>
                <th className="p-4 font-semibold text-cyan-400 bg-cyan-950/20">Scale</th>
                <th className="p-4 font-semibold text-white">Business</th>
                <th className="p-4 font-semibold text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172030] text-slate-300">
              {comparisonFeatures.map((row) => (
                <tr key={row.feature} className="hover:bg-[#111827] transition-colors">
                  <td className="p-4 font-medium text-white">{row.feature}</td>
                  <td className="p-4 font-mono text-slate-400">{row.free}</td>
                  <td className="p-4 font-mono text-slate-300">{row.starter}</td>
                  <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10 font-semibold">{row.scale}</td>
                  <td className="p-4 font-mono text-slate-300">{row.business}</td>
                  <td className="p-4 font-mono text-slate-300">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
