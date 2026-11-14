import type { NewsfeedItem } from "./types";

import type { AstroIntegrationLogger } from "astro";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { JSDOM } from "jsdom";

export const feedTitle = "Pivot to AI";
export const feedUrl = new URL("https://pivot-to-ai.com/feed/");

function buildNewsfeedFromDoc(
    doc: Document,
    logger: AstroIntegrationLogger,
): NewsfeedItem[] {
    let newsfeedItems = [] as NewsfeedItem[];

    const items = doc.querySelectorAll("item");
    for (const item of items) {
        const guid = item.querySelector("guid")?.textContent;
        const title = item.querySelector("title")?.textContent;
        const url = item.querySelector("link")?.textContent;

        if (!guid || !title || !url) {
            const entry = `{guid='${guid} title='${title}' url='${url}'}`;
            logger.info(`skipping bad entry: ${entry}`);
            continue; // skip bad entries
        }

        newsfeedItems.push({
            guid,
            title,
            url,
        });
    }

    return newsfeedItems;
}

export function newsfeedLoader() {
    // access the window object via JSDOM
    const window = new JSDOM().window;

    return {
        name: "newsfeed",
        load: async ({ store, parseData, logger }) => {
            const feed = await fetch(feedUrl)
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
        schema: z.object({
            guid: z.string(),
            title: z.string(),
            url: z.url(),
        }),
    } satisfies Loader;
}
