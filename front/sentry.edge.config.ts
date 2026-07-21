// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://555bb4e23d1290522504d9821068c2c2@sentry.thinkingoutloud.ru/5",

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    beforeSend(event) {
        // Check if the event contains a request and if the URL matches mc.yandex.ru
        if (
            event.request &&
            event.request.url &&
            event.request.url.includes("mc.yandex.ru")
        ) {
            return null; // Returning null will prevent the event from being sent to Sentry
        }
        return event; // Otherwise, return the event to be sent
    },
});
