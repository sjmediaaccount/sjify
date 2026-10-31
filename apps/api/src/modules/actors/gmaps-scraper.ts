import puppeteer from 'puppeteer-core';
import fs from 'fs';

export interface GoogleMapsScraperInput {
  searchStringsArray?: string[];
  locationQuery?: string;
  maxCrawledPlacesPerSearch?: number;
  language?: string;
  website?: 'withoutWebsite' | 'allPlaces';
  onlyWithoutWebsite?: boolean;
  skipClosedPlaces?: boolean;
}

export interface GoogleMapsPlaceResult {
  title: string;
  category: string;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewsCount: number;
  placeId: string;
  googleMapsUrl: string;
  openingHours: string;
}

function getBrowserExecutablePath(): string {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  for (const p of chromePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error('No supported Chrome or Edge browser executable found on system.');
}

export async function scrapeGoogleMapsPlaces(
  input: GoogleMapsScraperInput
): Promise<GoogleMapsPlaceResult[]> {
  const searchTerms = Array.isArray(input.searchStringsArray) && input.searchStringsArray.length > 0
    ? input.searchStringsArray
    : ['dentist'];

  const location = (input.locationQuery || 'United Kingdom').trim();
  const maxPlacesPerSearch = Math.min(Math.max(Number(input.maxCrawledPlacesPerSearch) || 10, 1), 50);
  const language = input.language || 'en';
  const filterWithoutWebsite = input.website === 'withoutWebsite' || input.onlyWithoutWebsite === true;
  const skipClosed = input.skipClosedPlaces !== false;

  const executablePath = getBrowserExecutablePath();

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      `--lang=${language}-GB,${language}`,
    ],
  });

  const allResults: GoogleMapsPlaceResult[] = [];
  const seenPlaceIds = new Set<string>();

  try {
    for (const term of searchTerms) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      );

      const fullQuery = location ? `${term} in ${location}` : term;
      const targetUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullQuery)}?hl=${encodeURIComponent(language)}`;

      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Handle cookie consent dialogs if present
      try {
        const buttons = await page.$$('button');
        for (const btn of buttons) {
          const btnText = await (await btn.getProperty('innerText')).jsonValue();
          if (btnText && (btnText.includes('Accept all') || btnText.includes('Reject all') || btnText.includes('I agree'))) {
            await btn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
            break;
          }
        }
      } catch {
        // No consent dialog shown
      }

      await page.waitForSelector('div[role="feed"], div[role="article"], a[href*="/maps/place/"]', { timeout: 15000 }).catch(() => {});

      // Scroll feed to load sufficient places
      try {
        await page.evaluate(async (maxTarget, withoutWeb) => {
          const feed = document.querySelector('div[role="feed"]') || document.body;
          const targetNeeded = withoutWeb ? Math.max(maxTarget * 3, 20) : maxTarget;
          let prevCount = 0;
          for (let i = 0; i < 5; i++) {
            const count = document.querySelectorAll('a[href*="/maps/place/"]').length;
            if (count >= targetNeeded || (i > 1 && count === prevCount)) break;
            prevCount = count;
            feed.scrollBy(0, 1800);
            await new Promise((r) => setTimeout(r, 900));
          }
        }, maxPlacesPerSearch, filterWithoutWebsite);
      } catch {
        // Scrolling complete
      }

      // Extract all places with their individual card data
      const rawPlaces = await page.evaluate(() => {
        const items: any[] = [];
        const links = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));

        for (const link of links) {
          const href = link.getAttribute('href') || '';
          const card = link.closest('div[role="article"]') || link.closest('div.Nv2PK') || link.parentElement;
          if (!card) continue;

          // Extract title
          const titleEl = card.querySelector('div.fontHeadlineSmall, .qBF1Pd, [role="heading"]');
          const title = titleEl ? titleEl.textContent?.trim() : (link.getAttribute('aria-label') || '').trim();
          if (!title || items.some((i) => i.title === title)) continue;

          // Extract real Place ID (ChIJ...)
          let placeId = '';
          const chijMatch = href.match(/(ChIJ[a-zA-Z0-9_-]{20,})/);
          if (chijMatch) {
            placeId = chijMatch[1];
          } else {
            const hexMatch = href.match(/1s(0x[a-f0-9]+:[0x[a-f0-9]+)/i);
            placeId = hexMatch ? hexMatch[1] : `ChIJ_${encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]/g, '_'))}`;
          }

          // Extract Rating & Reviews
          let rating: number | null = null;
          let reviewsCount = 0;
          const ratingEl = card.querySelector('span.MW4etd, span[aria-label*="stars"], span[aria-label*="star"]');
          if (ratingEl) {
            const rText = ratingEl.textContent?.trim().replace(',', '.') || '';
            const parsedR = parseFloat(rText);
            if (!isNaN(parsedR)) rating = parsedR;
          }

          const reviewsEl = card.querySelector('span.UY7F9, span[aria-label*="reviews"]');
          if (reviewsEl) {
            const revMatch = reviewsEl.textContent?.replace(/[(),]/g, '').trim() || '';
            const parsedRev = parseInt(revMatch, 10);
            if (!isNaN(parsedRev)) reviewsCount = parsedRev;
          }

          // Extract Website from card
          let website: string | null = null;
          const webAnchor = card.querySelector('a[data-value*="Website"], a[aria-label*="Website"], a[href^="http"]:not([href*="google.com"])');
          if (webAnchor) {
            website = webAnchor.getAttribute('href');
          } else {
            const btns = Array.from(card.querySelectorAll('button, a'));
            for (const b of btns) {
              const aria = b.getAttribute('aria-label') || b.textContent || '';
              const matchUrl = aria.match(/([a-zA-Z0-9-]+\.(?:co\.uk|org\.uk|com|net|io|org|co)[a-zA-Z0-9_\-./]*)/i);
              if (matchUrl && !matchUrl[1].toLowerCase().includes('google.')) {
                website = `https://${matchUrl[1]}`;
                break;
              }
            }
          }

          // Parse card text lines for category, address, phone, openingHours
          const cardText = card.innerText || '';
          const isClosed = cardText.includes('Permanently closed') || cardText.includes('Temporarily closed');

          const lines = cardText.split('\n').map((l) => l.trim()).filter(Boolean);
          let category = 'Dentist';
          let address = '';
          let phone: string | null = null;
          let openingHours = 'Open';

          for (const line of lines) {
            if (line.includes('Dentist') || line.includes('Dental') || line.includes('Clinic') || line.includes('Orthodontist') || line.includes('Surgery') || line.includes('Doctor')) {
              category = line.split('·')[0].trim();
            }
            if (line.includes('Open') || line.includes('Closed') || line.includes('Closes') || line.includes('Opens')) {
              openingHours = line;
            }
            if (
              line.match(/[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i) ||
              line.includes('St') ||
              line.includes('Road') ||
              line.includes('Rd') ||
              line.includes('Lane') ||
              line.includes('Ave') ||
              line.includes('Square') ||
              line.includes('Way')
            ) {
              if (!address && !line.includes('Closed') && !line.includes('Open')) {
                address = line.replace(/^[·\s]+/, '').replace(/·.*$/, '').trim();
              }
            }
            const phoneMatch = line.match(/(\+44\s?\d{2,4}\s?\d{3,4}\s?\d{3,4}|0\d{2,4}\s?\d{3,4}\s?\d{3,4})/);
            if (phoneMatch && !phone) {
              phone = phoneMatch[1].trim();
            }
          }

          items.push({
            title,
            category,
            rawAddress: address,
            phone,
            website,
            rating,
            reviewsCount,
            placeId,
            googleMapsUrl: href.startsWith('http') ? href : `https://www.google.com${href}`,
            openingHours,
            isClosed,
          });
        }

        return items;
      });

      // Filter and format individual results
      for (const p of rawPlaces) {
        if (seenPlaceIds.has(p.placeId)) continue;
        if (skipClosed && p.isClosed) continue;
        if (filterWithoutWebsite && p.website) continue;

        let phone = p.phone;
        let address = p.rawAddress;

        // If phone is missing, attempt quick detail fetch for this specific card
        if (!phone && allResults.length < maxPlacesPerSearch) {
          try {
            const linkHandle = await page.$(`a[href*="${p.placeId}"]`);
            if (linkHandle) {
              await linkHandle.click();
              // Wait briefly for panel title to match this place
              await page.waitForFunction(
                (expected) => {
                  const heading = document.querySelector('h1.DUwDvf')?.textContent?.trim();
                  return heading && heading.includes(expected);
                },
                { timeout: 2500 },
                p.title.slice(0, 15)
              ).catch(() => {});

              const panelData = await page.evaluate((expected) => {
                const heading = document.querySelector('h1.DUwDvf')?.textContent?.trim() || '';
                if (!heading.includes(expected)) return null;

                const phoneBtn = document.querySelector('button[data-item-id*="phone:"], [aria-label*="Phone:"], button[data-tooltip*="Copy phone number"]');
                const phoneVal = phoneBtn ? (phoneBtn.getAttribute('aria-label') || phoneBtn.textContent || '').replace(/Phone:|\s+/g, ' ').trim() : null;

                const addrBtn = document.querySelector('button[data-item-id*="address"], [aria-label*="Address:"], button[data-tooltip*="Copy address"]');
                const addrVal = addrBtn ? (addrBtn.getAttribute('aria-label') || addrBtn.textContent || '').replace(/Address:/g, '').trim() : null;

                return { phoneVal, addrVal };
              }, p.title.slice(0, 15));

              if (panelData?.phoneVal) phone = panelData.phoneVal;
              if (panelData?.addrVal && !address) address = panelData.addrVal;
            }
          } catch {
            // detail fetch fallback
          }
        }

        const formattedAddress = address
          ? (address.toLowerCase().includes(location.toLowerCase())
              ? `${address}, United Kingdom`
              : `${address}, ${location}, United Kingdom`)
          : `${location}, United Kingdom`;

        seenPlaceIds.add(p.placeId);
        allResults.push({
          title: p.title,
          category: p.category,
          address: formattedAddress,
          city: location,
          country: 'United Kingdom',
          phone: phone || null,
          website: p.website || null,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          placeId: p.placeId,
          googleMapsUrl: p.googleMapsUrl,
          openingHours: p.openingHours,
        });

        if (allResults.length >= maxPlacesPerSearch) {
          break;
        }
      }

      await page.close();
      if (allResults.length >= maxPlacesPerSearch) {
        break;
      }
    }
  } finally {
    await browser.close();
  }

  return allResults.slice(0, maxPlacesPerSearch);
}
