# Project structure sub-agent

Keep this layout:

```
client/src/components/layout
client/src/components/home
client/src/components/listing
client/src/components/gallery
server/src/data/seedData.js
server/src/store.js
docs/architecture.svg
```

Do not add auth, payments, or write APIs unless the user asks. Prefer small presentational components over a second state library.
