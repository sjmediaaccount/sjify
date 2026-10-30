'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Plus, ArrowUpRight, BarChart3, Star } from 'lucide-react';

export default function MyActorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">My Actors (Developer Studio)</h1>
          <p className="text-xs text-slate-400">
            Publish, monetize, and maintain your custom automation containers.
          </p>
        </div>
        <Link
          href="/actors/new"
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-xs shadow-glow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Actor
        </Link>
      </div>

      <div className="p-6 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel text-center py-12 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
          <Code2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">Publish Actors & Earn Recurring Revenue</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Set up rental subscriptions or pay-per-result pricing for your scrapers. Receive monthly payouts via Stripe Connect.
        </p>
        <div className="pt-2">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Inspect Developer Revenue & Analytics <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
