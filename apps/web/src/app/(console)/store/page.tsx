'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Box, Star, Users, Play, ArrowUpDown, Filter } from 'lucide-react';

export default function StorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'AI & LLMs',
    'Lead Generation',
    'E-Commerce',
    'Social Media',
    'SEO & SERP',
    'Real Estate',
    'Developer Tools',
  ];

  const storeActors = [
    {
      id: 'website-content-crawler',
      title: 'Website Content Crawler',
      author: 'sjify',
      category: 'AI & LLMs',
      desc: 'Crawl full websites recursively. Extracts clean markdown and HTML ready for RAG pipelines and vector embeddings.',
      runs: '18,450',
      users: '4,210',
      rating: 4.9,
      ratingCount: 142,
      pricing: 'Free',
      badge: 'Featured',
    },
    {
      id: 'google-search-scraper',
      title: 'Google Search Results Scraper',
      author: 'sjify',
      category: 'SEO & SERP',
      desc: 'Extract real-time SERP rankings, organic results, ads, People Also Ask, and localized knowledge graph data.',
      runs: '45,900',
      users: '8,400',
      rating: 5.0,
      ratingCount: 215,
      pricing: '$0.002 / res',
      badge: 'Pay per result',
    },
    {
      id: 'generic-web-scraper',
      title: 'Generic Web Scraper',
      author: 'sjify',
      category: 'Developer Tools',
      desc: 'Blazing fast Cheerio-based HTML scraping engine with CSS selectors and automated pagination.',
      runs: '12,300',
      users: '2,980',
      rating: 4.8,
      ratingCount: 98,
      pricing: 'Free',
      badge: 'Lightweight',
    },
    {
      id: 'ecommerce-product-scraper',
      title: 'E-commerce Product & Price Scraper',
      author: 'sjify',
      category: 'E-Commerce',
      desc: 'Monitor price fluctuations, product specifications, inventory levels, and customer reviews across major stores.',
      runs: '8,700',
      users: '1,250',
      rating: 4.7,
      ratingCount: 64,
      pricing: '$19.99 / mo',
      badge: 'Rental',
    },
    {
      id: 'sitemap-xml-extractor',
      title: 'Sitemap XML Extractor',
      author: 'sjify',
      category: 'Developer Tools',
      desc: 'Traverse complex multi-level XML sitemaps and gzip archives to build a comprehensive URL database.',
      runs: '7,200',
      users: '1,800',
      rating: 4.9,
      ratingCount: 42,
      pricing: 'Free',
      badge: 'Utility',
    },
  ];

  const filtered = storeActors.filter((actor) => {
    const matchesCategory = selectedCategory === 'All' || actor.category === selectedCategory;
    const matchesSearch =
      actor.title.toLowerCase().includes(search.toLowerCase()) ||
      actor.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">SJify Store</h1>
        <p className="text-xs text-slate-400">
          Discover, run, and integrate ready-made containerized scrapers and automation tools.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search thousands of Actors by name, keyword, or target website..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D131F] border border-[#1A2538] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-semibold shadow-glow-sm'
                  : 'bg-[#0D131F] text-slate-400 hover:text-white border border-[#1A2538]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Actors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((actor) => (
          <div
            key={actor.id}
            className="p-5 rounded-2xl bg-[#0D131F] border border-[#1A2538] glass-panel-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-teal-400/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{actor.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">{actor.author}/{actor.id}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {actor.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                {actor.desc}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#172030] flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {actor.rating} ({actor.ratingCount})
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {actor.users}
                </span>
              </div>

              <Link
                href={`/store/${actor.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-glow-sm"
              >
                <Play className="w-3 h-3 fill-current" />
                Try Free
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
