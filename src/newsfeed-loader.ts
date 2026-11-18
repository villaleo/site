import { NewsFeedLoaderSchema, type NewsfeedItem } from "./types";

import type { AstroIntegrationLogger } from "astro";
import type { Loader } from "astro/loaders";
import { JSDOM } from "jsdom";

const FEED_URL = new URL("https://pivot-to-ai.com/feed/");

function buildNewsfeedFromDoc(
    doc: Document,
    logger: AstroIntegrationLogger,
): NewsfeedItem[] {
    let newsfeedItems = [] as NewsfeedItem[];

    for (const item of doc.querySelectorAll("item")) {
        const postId = item.querySelector("post-id")?.textContent;
        const title = item.querySelector("title")?.textContent || "Untitled";
        const url = item.querySelector("link")?.textContent;
        const publicationDateStr = item.querySelector("pubDate")?.textContent;
        const escapedDescription =
            item.querySelector("description")?.textContent;

        if (!postId || !url || !escapedDescription || !publicationDateStr) {
            logger.info(`skipping over feed item`);
            continue;
        }

        newsfeedItems.push({
            guid: postId,
            title,
            url,
            publicationDate: new Date(publicationDateStr),
            description: escapedDescription,
        });
    }

    return newsfeedItems;
}

export function newsfeedLoader() {
    // access the window object via JSDOM
    const window = new JSDOM().window;

    return {
        name: "newsfeed",
        schema: NewsFeedLoaderSchema,
        load: async ({ store, parseData, logger }) => {
            const feed = await fetch(FEED_URL)
                .then((response) => {
                    logger.info("fetching feed items..");
                    return response.text();
                })
                .then((text) => {
                    logger.info("parsing response..");
                    return new window.DOMParser().parseFromString(
                        text,
                        "text/xml",
                    );
                })
                .then((doc) => {
                    logger.info("building collection from document..");
                    return buildNewsfeedFromDoc(doc, logger);
                })
                .catch((error) => {
                    logger.error("failed to build newsfeed loader");
                    logger.error(error);
                    return [] as NewsfeedItem[];
                });

            store.clear();
            for (const item of feed) {
                const id = item.guid;
                const data = await parseData({ id, data: item });
                store.set({ id, data });
            }
        },
    } satisfies Loader;
}
