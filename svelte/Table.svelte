<script>
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import trim from 'lodash/trim';
	import uniq from 'lodash/uniq';

	let input; // Input field
	let items = []; // All items
	let result = []; // Filtered items
	let fuse; // Fuse instance
	let mediums = [];
	let selectedMedium;

	const options = {
    keys: [
      'title',
      'description', // TODO: Is this used?
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
		if (term.length && fuse || selectedMedium) {
			let expression = term
			if (selectedMedium && term.length) {
				expression = {
				  $and: [
				    term,
				    { medium: `'${selectedMedium}`}
				  ]
				}
			} else if (selectedMedium && !term.length) {
				expression = `'${selectedMedium}`
			}
			result = fuse.search(expression).map((d) => d.item)
		} else {
			result = items
		}
	}

	function selectMedium (medium) {
		selectedMedium = selectedMedium === medium ? false : medium;
		handleInput()
	}

	onMount (async () => {
	  fetch('/items.json')
	    .then(res => res.json())
	    .then(data => {
	      items = data;
	      fuse = new Fuse(data, options);
	      mediums = uniq(data.map(({ medium }) => medium)).sort()
	      handleInput()
	    });
	})
</script>

<!-- <ul>
	{#each mediums as medium}
	<li on:click={() => selectMedium(medium)}>{ medium }</li>
	{/each}
</ul> -->
<input type="text" on:input={handleInput} placeholder="Search…" bind:this={input} class="search" />

<ul class="plain">
	{#each result as { title, authors, aspect, topic, aspect, aspectID, year, link }}
	<li>
		<a href="{link}" class="link-table" target="_blank">
			<span class="title">{ title }</span>
			<span class="authors">{ authors }</span>
			<span class="year">{ year }</span>
			<a href="/#{ aspectID }" class="aspect">{ aspect }</a>
			<i class="reference-icon">↗</i>
		</a>
	</li>
	{/each}
</ul>
