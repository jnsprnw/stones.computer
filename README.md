# Stones that calcuate

Collection of resources about **post-digital materiality** compiled by [Jonas](https://jonasparnow.com) and [Paul](http://paulheinicker.com/)

→ [stones.computer](https://stones.computer)

The website is mostly powered by Hugo. Some interactive parts are rendered by Svelte. We use `npm-run-all` to run both processes at the same time. Svelte build its script into the assets folder, where it is then loaded by Hugo.

More information on [https://gitlab.com/datwood/hugo-svelte](https://gitlab.com/datwood/hugo-svelte).

## Sources
The file name is the short form of the title of the source in dash case, e.g. `the-stack.md`

```
---
title: "The Stack: On Software and Sovereignty" # title of the source
date: 2020-09-09T17:32:36+02:00 # date of the last edit
draft: false # this must be false
aspect: "upscaling" # id of the related aspect
authors: ["Benjamin Bratton"] # list of authors as array
link: "https://mitpress.mit.edu/books/stack" # link to the source
medium: "book" # the medium of the source
year: 2016 # release year
tags: ["The Stack", "accidental megastructure","planetary-scale computation", "diagram"] # tags that help the search on the archive page
weight: 1 # number in the sidebar of the aspect
notReferenced: true # if the source is not directly referenced in the text
archiveOnly: true # if the source is just displayed in the archive
---
```

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
