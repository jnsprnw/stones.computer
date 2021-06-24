# Stones that calcuate

Collection of resources about **post-digital materiality** compiled by [Jonas](https://jonasparnow.com) and [Paul](http://paulheinicker.com/)

→ [stones.computer](https://stones.computer)

The website is mostly powered by Hugo. Some interactive parts are rendered by Svelte. We use `npm-run-all` to run both processes at the same time. Svelte build its script into the assets folder, where it is then loaded by Hugo.

More information on [https://gitlab.com/datwood/hugo-svelte](https://gitlab.com/datwood/hugo-svelte).

### Serve
To start both Hugo and Svelte run:
```
npm run dev
```

### Build
To build both Hugo and Svelte run:
```
npm run build
```
