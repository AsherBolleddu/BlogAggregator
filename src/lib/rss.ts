import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    method: "GET",
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const xml = await response.text();
  const xmlParser = new XMLParser();
  const feed = xmlParser.parse(xml) as {
    rss?: { channel?: RSSFeed["channel"] };
  };
  const channel = feed.rss?.channel;

  if (!channel?.title || !channel?.link || !channel?.description) {
    throw new Error("Missing channel title, link, or description");
  }

  const rawItems = Array.isArray(channel.item) ? channel.item : [];
  const items: RSSItem[] = rawItems
    .filter((item) =>
      Boolean(item.title && item.description && item.link && item.pubDate)
    )
    .map((item) => {
      return {
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      };
    });

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: items,
    },
  };
}
