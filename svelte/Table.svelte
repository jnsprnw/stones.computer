<script>
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import trim from 'lodash/trim';

	let input; // Input field
	let items = []; // All items
	let result = []; // Filtered items
	let fuse; // Fuse instance

	const options = {
    keys: [
      'title',
      'description',
      'authors',
      'aspect',
      'topic',
      'medium',
      'tags',
      'link',
      'year',
      'people'
    ]
  };

	function handleInput () {
		const term = trim(input.value)
		// First, check if search term is present and fuse has been initialised
		// If false, return all items
		// If true, return fuse search results but map over them to bring forward the item
		// This is because fuse add search metadata to the results.
		// This would conflict with returning the simple list of all items
		result = term.length && fuse ? fuse.search(term).map((d) => d.item) : items
	}

	onMount (async () => {
	  fetch('/items.json')
	    .then(res => res.json())
	    .then(data => {
	      items = data;
	      fuse = new Fuse(data, options);
	      handleInput()
	    });
	})
</script>

<input type="text" on:input={handleInput} placeholder="Search…" bind:this={input} class="search" />

<ul class="plain">
	{#each result as { title, authors, aspect, topic, aspect, aspectID, year, link }}
	<li>
		<a href="{link}" class="link-table">
			<span class="title">{ title }</span>
			<span class="authors">{ authors }</span>
			<span class="year">{ year }</span>
			<a href="/#{ aspectID }" class="aspect">{ aspect }</a>
			<i class="reference-icon">↗</i>
		</a>
	</li>
	{/each}
</ul>
