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

  $: currentActive = Math.max((compact(map(tops, (top) => top < y))).length - 1, 0)

  function getIcon (i, c) {
    if (i === c) { return '&#8594;' }
    if (i < c) { return '&#8593;' }
    return '&#8595;'
  }

  function getTops () {
    const offset = window.innerHeight / 2
    tops = map(anchors, ({ id }) => document.getElementById(id).offsetTop - offset)
  }
</script>

<svelte:window bind:scrollY={y} on:resize={getTops} />

<nav>
  {#each anchors as { id, label }, i}
  <a href={`#${id}`} class:isActive={i === currentActive }><i>{ @html getIcon(i, currentActive) }</i> { label }</a>
  {/each}
  <a href="/table"><i>↗</i> References</a>
</nav>