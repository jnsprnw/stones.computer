<script>
  import { onMount } from 'svelte';
  import map from 'lodash/map';
  import compact from 'lodash/compact';

  let y;

  const anchors = [{
    id: 'intro',
    label: 'Intro'
  }, {
    id: 'topics',
    label: 'Topics'
  }, {
    id: 'aspects',
    label: 'Aspects'
  }, {
    id: 'outro',
    label: 'Outro'
  }]

  let tops = []

  onMount (async () => {
    getTops();
  })

  // First, we loop over each top-position and check if it already reached
  // Then, we filter each not-yet-reached out
  // The length of elements minus one is the index of the last one
  // If no one is reached, we still highlight the first one by having a min value of 0
  $: currentActive = Math.max((compact(map(tops, (top) => top < y))).length - 1, 0)

  function getIcon (i, c) {
    if (i === c) { return '&#8594;' }
    if (i < c) { return '&#8593;' }
    return '&#8595;'
  }

  function getTops () {
    const offset = window.innerHeight / 2 // Half the window size. We use this to trigger the reached status already have way through
    tops = map(anchors, ({ id }) => document.getElementById(id).offsetTop - offset)
  }

  function scrollTo (id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }
</script>

<svelte:window bind:scrollY={y} on:resize={getTops} />

<nav>
  {#each anchors as { id, label }, i}
  <a on:click={() => scrollTo(id)} class="internal" class:isActive={i === currentActive }><i>{ @html getIcon(i, currentActive) }</i> { label }</a>
  {/each}
  <a href="/table"><i>↗</i> References</a>
</nav>