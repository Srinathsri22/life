import { getCollection } from 'astro:content';

export async function GET(context) {
  const site = context.site?.href ?? 'https://srinath.is-a.dev/';
  const entries = (await getCollection('journal', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const esc = (s = '') => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const items = entries.map((e) => `    <item>
      <title>${esc(e.data.title)}</title>
      <link>${site}journal/${e.id}/</link>
      <guid>${site}journal/${e.id}/</guid>
      <pubDate>${e.data.date.toUTCString()}</pubDate>
      <description>${esc(e.data.summary ?? '')}</description>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Srinath — journal</title>
    <link>${site}</link>
    <description>Book notes, memories, trips and stray thoughts.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
