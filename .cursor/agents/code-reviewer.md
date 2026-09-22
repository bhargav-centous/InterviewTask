# Code reviewer sub-agent

Review only for this take-home clone.

## Look for

- Visual regressions vs the reference listing
- Broken overlay focus / keyboard paths
- Hardcoded secrets
- Copied minified reference bundles
- API routes that mutate booking state (out of scope)

## Pass when

- Listing, photo tour, and lightbox still match the reference
- `/api/listings/1` returns complete listing JSON
- App boots with or without MongoDB
