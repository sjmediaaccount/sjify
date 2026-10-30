'use client';

import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  FolderTree,
  Play,
  Save,
  RotateCcw,
  Hammer,
  Check,
  ChevronRight,
  ChevronDown,
  Terminal,
  FileText,
  Boxes,
} from 'lucide-react';

interface ActorStudioProps {
  actorId: string;
  actorName: string;
}

export function ActorStudio({ actorId, actorName }: ActorStudioProps) {
  const [activeFile, setActiveFile] = useState('src/main.js');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [showBuildLogs, setShowBuildLogs] = useState(false);

  const [files, setFiles] = useState<Record<string, string>>({
    'src/main.js': `import { Actor } from '@sjify/actor-sdk';
import { CheerioCrawler, log } from 'crawlee';

await Actor.init();

const input = await Actor.getInput() ?? {};
const { startUrls = ['https://news.ycombinator.com'], maxItems = 50 } = input;

log.info('SJify Actor started', { maxItems });

let totalScraped = 0;

const crawler = new CheerioCrawler({
  maxRequestsPerCrawl: 20,
  async requestHandler({ $, request, enqueueLinks }) {
    log.info(\`Scraping URL: \${request.url}\`);

    $('tr.athing').each(async (_, el) => {
      if (totalScraped >= maxItems) return;
      const title = $(el).find('span.titleline > a').text();
      const url = $(el).find('span.titleline > a').attr('href');
      const rank = $(el).find('span.rank').text().replace('.', '');

      await Actor.pushData({
        rank: Number(rank),
        title,
        url,
        scrapedAt: new Date().toISOString(),
      });
      totalScraped++;
    });
  },
});

await crawler.run(startUrls);
await Actor.exit();
`,
    'Dockerfile': `FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Run Actor as unprivileged container user
USER node
CMD ["node", "src/main.js"]
`,
    '.actor/actor.json': `{
  "actorSpecification": 1,
  "name": "website-content-crawler",
  "title": "Website Content Crawler",
  "version": "1.0.0",
  "buildTag": "latest",
  "environmentVariables": {
    "NODE_ENV": "production"
  },
  "defaultMemoryMbytes": 1024,
  "defaultTimeoutSecs": 3600
}
`,
    '.actor/INPUT_SCHEMA.json': `{
  "title": "Website Content Crawler Input",
  "type": "object",
  "schemaVersion": 1,
  "properties": {
    "startUrls": {
      "title": "Start URLs",
      "type": "array",
      "description": "List of URLs to scrape",
      "editor": "globs",
      "prefill": [{ "url": "https://news.ycombinator.com" }]
    },
    "maxItems": {
      "title": "Max Scraped Items",
      "type": "integer",
      "description": "Maximum records to push to the dataset",
      "default": 50,
      "minimum": 1
    },
    "useStealthProxy": {
      "title": "Enable Stealth Residential Proxy",
      "type": "boolean",
      "default": true
    }
  },
  "required": ["startUrls"]
}
`,
    'package.json': `{
  "name": "website-content-crawler",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@sjify/actor-sdk": "^1.0.0",
    "crawlee": "^3.11.0",
    "playwright": "^1.44.0"
  }
}
`,
    'README.md': `# Website Content Crawler

Production-grade crawler that traverses target websites and generates clean markdown / structured dataset records.

### How to Run
Provide target start URLs and click **Start Run**.
`,
  });

  const fileTree = [
    { name: 'src/main.js', icon: FileCode },
    { name: 'Dockerfile', icon: Boxes },
    { name: '.actor/actor.json', icon: FileText },
    { name: '.actor/INPUT_SCHEMA.json', icon: FileText },
    { name: 'package.json', icon: FileText },
    { name: 'README.md', icon: FileText },
  ];

  const handleBuild = () => {
    setIsBuilding(true);
    setShowBuildLogs(true);
    setBuildSuccess(false);

    setTimeout(() => {
      setIsBuilding(false);
      setBuildSuccess(true);
    }, 2500);
  };

  return (
    <div className="rounded-2xl bg-[#080D15] border border-[#172233] overflow-hidden flex flex-col h-[650px]">
      {/* Studio Top Control Strip */}
      <div className="flex items-center justify-between p-3 bg-[#0D131F] border-b border-[#1E2B40]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white text-xs font-mono">{actorName} Studio</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Node.js 20
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Code changes saved successfully')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1A2538] text-slate-300 text-xs font-semibold border border-[#1E2B40]"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
          <button
            onClick={handleBuild}
            disabled={isBuilding}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs shadow-glow-sm hover:opacity-95 disabled:opacity-50"
          >
            <Hammer className="w-3.5 h-3.5" />
            {isBuilding ? 'Building Docker Image...' : 'Build & Deploy Image'}
          </button>
        </div>
      </div>

      {/* Main Studio Body: File Tree + Editor */}
      <div className="flex-1 flex min-h-0">
        {/* Left: File Tree Explorer */}
        <div className="w-60 bg-[#0A0F1A] border-r border-[#172233] p-3 overflow-y-auto space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-500 uppercase font-semibold">
            Files & Manifest
          </div>
          {fileTree.map((f) => {
            const Icon = f.icon;
            const isActive = activeFile === f.name;
            return (
              <button
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate">{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Monaco-Style Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#07090E]">
          {/* Active File Tab Header */}
          <div className="flex items-center px-4 py-2 bg-[#090E17] border-b border-[#172233] text-xs font-mono text-cyan-400">
            <span>{activeFile}</span>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto">
            <textarea
              value={files[activeFile] || ''}
              onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
              className="w-full h-full bg-transparent text-slate-200 resize-none focus:outline-none leading-relaxed font-mono selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Bottom Drawer: Live Build Logs */}
      {showBuildLogs && (
        <div className="h-44 bg-[#080D15] border-t border-[#172233] p-3 font-mono text-xs overflow-y-auto space-y-1">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#172233]">
            <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Build Pipeline Output (Tag: latest)
            </span>
            <button onClick={() => setShowBuildLogs(false)} className="text-slate-500 hover:text-white text-xs">
              ✕
            </button>
          </div>
          <p className="text-slate-400">[1/4] Packing source bundle to tar archive...</p>
          <p className="text-slate-400">[2/4] Sending build context to Docker Engine daemon...</p>
          {isBuilding && <p className="text-cyan-300 animate-pulse">[3/4] Step 3/5: RUN npm install --omit=dev...</p>}
          {buildSuccess && (
            <>
              <p className="text-slate-400">[3/4] Step 3/5: RUN npm install --omit=dev (Cached)</p>
              <p className="text-slate-400">[4/4] Successfully tagged image: sjify-registry.local/actors/{actorId}:latest</p>
              <p className="text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                <Check className="w-3.5 h-3.5" />
                Build SUCCEEDED (Digest: sha256:7f89d...12) • Ready to run
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
