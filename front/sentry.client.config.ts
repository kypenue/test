// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://555bb4e23d1290522504d9821068c2c2@sentry.thinkingoutloud.ru/5",

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

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
