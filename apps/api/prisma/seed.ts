import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Seeding SJify database with realistic demo data...');

  // 1. Create Default Admin & Developer Users
  const passwordHash = await bcrypt.hash('sjifyAdmin2026!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sjify.io' },
    update: {},
    create: {
      email: 'admin@sjify.io',
      name: 'SJify Admin',
      passwordHash,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const devUser = await prisma.user.upsert({
    where: { email: 'developer@sjify.io' },
    update: {},
    create: {
      email: 'developer@sjify.io',
      name: 'Alex Rivera',
      passwordHash,
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  // 2. Create Organizations
  const primaryOrg = await prisma.organization.upsert({
    where: { slug: 'sjify-core' },
    update: {},
    create: {
      name: 'SJify Core Team',
      slug: 'sjify-core',
      ownerId: admin.id,
      planTier: 'SCALE',
      monthlySpendingLimitUsd: 250.0,
      currentMonthSpendUsd: 14.85,
      isHardLimitReached: false,
      nextBillingDate: new Date(Date.now() + 18 * 86400000),
      members: {
        create: [
          { userId: admin.id, role: 'OWNER' },
          { userId: devUser.id, role: 'DEVELOPER' },
        ],
      },
    },
  });

  // 3. Create Sample API Token
  const tokenSecret = 'dev_token_secret_1234567890abcdef';
  const tokenHash = crypto.createHash('sha256').update(`sjify_api_${tokenSecret}`).digest('hex');

  await prisma.apiToken.upsert({
    where: { tokenHash },
    update: {},
    create: {
      userId: admin.id,
      orgId: primaryOrg.id,
      name: 'Development CLI & MCP Key',
      tokenHash,
      tokenPrefix: 'sjify_api_dev_...cdef',
      scopes: JSON.stringify(['*']),
      lastUsedAt: new Date(),
    },
  });

  // 4. Create 5 Store Seed Actors
  const seedActors = [
    {
      name: 'Website Content Crawler',
      slug: 'website-content-crawler',
      username: 'sjify',
      description: 'Recursively crawls websites, renders client-side JavaScript, extracts clean markdown and HTML content for LLM ingestion and RAG.',
      pricingModel: 'FREE',
      ratingAvg: 4.9,
      ratingCount: 142,
      statsRunsTotal: 18450,
      statsUsersTotal: 4210,
      readmeMarkdown: `# Website Content Crawler\n\nA production-grade web crawler built on **Crawlee + Playwright** that recursively traverses target websites, bypasses basic bot defenses, and outputs clean markdown optimized for LLM pipelines and RAG.\n\n### Features\n- Headless browser rendering (JavaScript execution)\n- Automatic sitemap discovery and URL pattern matching\n- Content cleaning (strips ads, navigation, footers)\n- Generates markdown, HTML, and structured metadata.`,
      inputSchemaJson: {
        title: 'Crawler Input',
        type: 'object',
        properties: {
          startUrls: {
            title: 'Start URLs',
            type: 'array',
            editor: 'globs',
            prefill: [{ url: 'https://docs.github.com' }],
          },
          maxCrawlDepth: { title: 'Max Depth', type: 'integer', default: 2 },
          maxPagesPerCrawl: { title: 'Max Pages', type: 'integer', default: 25 },
          outputFormat: { title: 'Output Format', type: 'string', default: 'markdown', enum: ['markdown', 'html', 'json'] },
        },
        required: ['startUrls'],
      },
    },
    {
      name: 'Generic Web Scraper',
      slug: 'generic-web-scraper',
      username: 'sjify',
      description: 'Ultra-fast Cheerio-based web scraper. Extract custom structured data using CSS selectors or custom page evaluation functions.',
      pricingModel: 'FREE',
      ratingAvg: 4.8,
      ratingCount: 98,
      statsRunsTotal: 12300,
      statsUsersTotal: 2980,
      readmeMarkdown: `# Generic Web Scraper\n\nHigh-throughput scraper that fetches raw HTML and evaluates CSS selectors without browser overhead.\n\nIdeal for news portals, blogs, and public catalogs that don't require heavy single-page app rendering.`,
      inputSchemaJson: {
        title: 'Scraper Input',
        type: 'object',
        properties: {
          startUrls: { title: 'Target URLs', type: 'array', editor: 'globs', prefill: [{ url: 'https://news.ycombinator.com' }] },
          linkSelector: { title: 'Link Selector', type: 'string', default: 'a.storylink' },
          maxItems: { title: 'Max Items', type: 'integer', default: 50 },
        },
        required: ['startUrls'],
      },
    },
    {
      name: 'Google Search Results Scraper',
      slug: 'google-search-scraper',
      username: 'sjify',
      description: 'Scrapes Google SERP results (organic results, ads, people also ask, knowledge graph) with geographic targeting.',
      pricingModel: 'PAY_PER_RESULT',
      priceUsd: 0.002,
      ratingAvg: 5.0,
      ratingCount: 215,
      statsRunsTotal: 45900,
      statsUsersTotal: 8400,
      readmeMarkdown: `# Google Search Results Scraper\n\nExtract real-time Google search rankings across desktop and mobile user agents.\n\nSupports custom country domains, languages, search parameters, and geolocation proxies.`,
      inputSchemaJson: {
        title: 'Search Queries',
        type: 'object',
        properties: {
          queries: { title: 'Search Queries', type: 'array', default: ['AI web scraping tools'] },
          countryCode: { title: 'Country Code', type: 'string', default: 'us' },
          maxResultsPerQuery: { title: 'Max Results', type: 'integer', default: 20 },
        },
        required: ['queries'],
      },
    },
    {
      name: 'E-commerce Product & Price Scraper',
      slug: 'ecommerce-product-scraper',
      username: 'sjify',
      description: 'Extract product titles, SKU, prices, stock availability, ratings, and customer reviews from modern retail storefronts.',
      pricingModel: 'RENTAL',
      priceUsd: 19.99,
      ratingAvg: 4.7,
      ratingCount: 64,
      statsRunsTotal: 8700,
      statsUsersTotal: 1250,
      readmeMarkdown: `# E-commerce Product Scraper\n\nComprehensive product intelligence scraper capable of monitoring price movements, inventory changes, and competitor product listings.`,
      inputSchemaJson: {
        title: 'Product Scraper Input',
        type: 'object',
        properties: {
          productUrls: { title: 'Product or Category URLs', type: 'array', prefill: [{ url: 'https://demo-ecommerce.com/products' }] },
          extractReviews: { title: 'Extract Reviews', type: 'boolean', default: true },
        },
        required: ['productUrls'],
      },
    },
    {
      name: 'Sitemap XML Extractor',
      slug: 'sitemap-xml-extractor',
      username: 'sjify',
      description: 'Parses XML sitemaps and sitemap index files recursively to build complete URL inventories with lastmod dates.',
      pricingModel: 'FREE',
      ratingAvg: 4.9,
      ratingCount: 42,
      statsRunsTotal: 7200,
      statsUsersTotal: 1800,
      readmeMarkdown: `# Sitemap XML Extractor\n\nFast and reliable XML sitemap parser. Follows compressed (.xml.gz) archives and handles large multi-index sitemaps seamlessly.`,
      inputSchemaJson: {
        title: 'Sitemap Input',
        type: 'object',
        properties: {
          sitemapUrl: { title: 'Sitemap XML URL', type: 'string', default: 'https://docs.github.com/sitemap.xml' },
        },
        required: ['sitemapUrl'],
      },
    },
    {
      name: 'Google Maps Business Extractor',
      slug: 'google-maps-extractor',
      username: 'sjify',
      description: 'Extract verified business details, addresses, phone numbers, review ratings, opening hours, and website presence from Google Maps without API limits.',
      pricingModel: 'PAY_PER_RESULT',
      priceUsd: 0.005,
      ratingAvg: 4.95,
      ratingCount: 312,
      statsRunsTotal: 42100,
      statsUsersTotal: 9800,
      readmeMarkdown: `# Google Maps Business Extractor\n\nHigh-performance scraper for Google Maps places and business directories.\n\n### Key Capabilities\n- Multi-city and multi-keyword search matrix\n- Filter places without website for high-converting web design & marketing outreach\n- Extract verified phone numbers, postal codes, and star ratings\n- Top-tier lead enrichment with automatic web search fallback`,
      inputSchemaJson: {
        title: 'Google Maps Business Extractor Input',
        type: 'object',
        properties: {
          searchStringsArray: {
            title: 'Search Terms',
            type: 'array',
            description: 'Keywords to search on Google Maps',
            default: ['dentist'],
          },
          locationQuery: {
            title: 'Location / Region',
            type: 'string',
            default: 'United Kingdom',
          },
          cities: {
            title: 'Target Cities',
            type: 'array',
            default: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Bristol'],
          },
          maxCrawledPlacesPerSearch: {
            title: 'Max Places Per Search Term',
            type: 'integer',
            default: 50,
          },
          onlyWithoutWebsite: {
            title: 'Only Without Website',
            type: 'boolean',
            default: true,
          },
          skipClosedPlaces: {
            title: 'Skip Closed Places',
            type: 'boolean',
            default: true,
          },
          enrichWithWebSearch: {
            title: 'Enrich With Web Search',
            type: 'boolean',
            default: true,
          },
          countryCode: {
            title: 'Country Code',
            type: 'string',
            default: 'gb',
          },
          language: {
            title: 'Language',
            type: 'string',
            default: 'en',
          },
        },
        required: ['searchStringsArray'],
      },
    },
  ];

  for (const item of seedActors) {
    const actor = await prisma.actor.upsert({
      where: { username_slug: { username: item.username, slug: item.slug } },
      update: {},
      create: {
        orgId: primaryOrg.id,
        userId: admin.id,
        name: item.name,
        slug: item.slug,
        username: item.username,
        description: item.description,
        readmeMarkdown: item.readmeMarkdown,
        visibility: 'PUBLIC',
        pricingModel: item.pricingModel,
        priceUsd: item.priceUsd || 0,
        ratingAvg: item.ratingAvg,
        ratingCount: item.ratingCount,
        statsRunsTotal: item.statsRunsTotal,
        statsUsersTotal: item.statsUsersTotal,
        defaultMemoryMbytes: 1024,
        defaultTimeoutSecs: 3600,
        versions: {
          create: {
            versionTag: 'latest',
            dockerfileContent: `FROM node:20-alpine\nWORKDIR /usr/src/app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["node", "src/main.js"]`,
            actorJson: JSON.stringify({ actorSpecification: 1, name: item.slug, title: item.name }),
            inputSchemaJson: JSON.stringify(item.inputSchemaJson),
          },
        },
      },
    });

    // 5. Create Sample Runs and Datasets for the first Actor
    if (item.slug === 'website-content-crawler') {
      const version = await prisma.actorVersion.findFirst({ where: { actorId: actor.id } });

      // Create Dataset
      const dataset = await prisma.dataset.create({
        data: {
          orgId: primaryOrg.id,
          userId: admin.id,
          name: 'Hacker News Front Page Scrape',
          isNamed: true,
          itemCount: 5,
          totalSizeBytes: 4200,
          retentionDays: 14,
        },
      });

      // Insert Dataset Items
      const sampleItems = [
        { title: 'Show HN: SJify – Open Platform for Web Automation', points: 342, comments: 89, url: 'https://sjify.com', rank: 1 },
        { title: 'Reverse Engineering High-Performance Scrapers', points: 215, comments: 45, url: 'https://example.org/scraping', rank: 2 },
        { title: 'How Crawlee revolutionizes NodeJS web crawlers', points: 198, comments: 34, url: 'https://crawlee.dev', rank: 3 },
        { title: 'Building Streamable MCP Servers for AI Agents', points: 176, comments: 28, url: 'https://modelcontextprotocol.io', rank: 4 },
        { title: 'PostgreSQL vs SQLite for Containerized Task Queues', points: 154, comments: 51, url: 'https://example.com/databases', rank: 5 },
      ];

      for (let i = 0; i < sampleItems.length; i++) {
        await prisma.datasetItem.create({
          data: {
            datasetId: dataset.id,
            itemIndex: i,
            data: JSON.stringify(sampleItems[i]),
          },
        });
      }

      // Create Key-Value Store
      const kvs = await prisma.keyValueStore.create({
        data: {
          orgId: primaryOrg.id,
          userId: admin.id,
          name: 'Run State Store',
          isNamed: true,
          recordCount: 2,
          totalSizeBytes: 1200,
        },
      });

      await prisma.keyValueRecord.create({
        data: {
          storeId: kvs.id,
          key: 'INPUT',
          contentType: 'application/json',
          valueText: JSON.stringify({ startUrls: [{ url: 'https://news.ycombinator.com' }], maxPages: 1 }),
        },
      });

      // Create Sample Runs
      await prisma.actorRun.create({
        data: {
          actorId: actor.id,
          versionId: version?.id || '',
          orgId: primaryOrg.id,
          userId: admin.id,
          status: 'SUCCEEDED',
          origin: 'WEB',
          allocatedMemoryMbytes: 1024,
          startedAt: new Date(Date.now() - 3600000),
          finishedAt: new Date(Date.now() - 3550000),
          durationSeconds: 50,
          chargedUsageUsd: 0.014,
          resultsCount: 5,
          statusMessage: 'Crawl completed successfully. 5 items extracted.',
          defaultDatasetId: dataset.id,
          defaultKeyValueStoreId: kvs.id,
        },
      });

      await prisma.actorRun.create({
        data: {
          actorId: actor.id,
          versionId: version?.id || '',
          orgId: primaryOrg.id,
          userId: admin.id,
          status: 'RUNNING',
          origin: 'SCHEDULE',
          allocatedMemoryMbytes: 2048,
          startedAt: new Date(Date.now() - 120000),
          durationSeconds: 120,
          statusMessage: 'Processing page 12 of 25. Waiting for rate limit cooldown...',
          defaultDatasetId: dataset.id,
        },
      });

      // Create Saved Task
      await prisma.actorTask.create({
        data: {
          orgId: primaryOrg.id,
          userId: admin.id,
          actorId: actor.id,
          name: 'Daily Documentation Indexer',
          description: 'Recursively syncs target developer docs into markdown for RAG',
          inputJson: JSON.stringify({
            startUrls: [{ url: 'https://docs.sjify.com' }],
            maxPagesPerCrawl: 50,
          }),
          memoryMbytes: 1024,
          timeoutSecs: 1800,
        },
      });
    }
  }

  // 6. Create Default Proxy Group
  await prisma.proxyGroup.create({
    data: {
      orgId: primaryOrg.id,
      name: 'Default Datacenter Pool',
      groupType: 'DATACENTER',
      host: 'proxy.sjify.com',
      port: 8000,
      countryOptions: JSON.stringify(['US', 'GB', 'DE', 'FR', 'NL']),
      isHealthy: true,
    },
  });

  console.log('[Seed] Database seeded successfully with users, orgs, actors, datasets, and runs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
