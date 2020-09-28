const Sentry  = require("@sentry/node");
const Tracing = require("@sentry/tracing");


function alert() {
    Sentry.init({
    dsn: "https://29dd7c87af114fef9ebf3662b9d550e7@o448226.ingest.sentry.io/5429245",
    tracesSampleRate: 1.0,
    debug: false
    });
}

module.exports = alert