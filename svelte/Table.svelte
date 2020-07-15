<script>
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';

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
		const term = input.value
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
	{#each result as { title, authors, aspect, topic, aspect, aspectID, year, link }, i}
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
