<script>
  import { onMount } from 'svelte';
  import { scalePoint } from 'd3-scale';
  import range from 'lodash/range';
  import map from 'lodash/map';

  let width = 0;
  let height = 0;
  const margin = 20;
  let svg;

  let nodes = [];
  const edges = [];
  let activeNodes = [];
  let activeEdges = [];

  function handleover (links, id) {
    activeNodes = links
    activeEdges = links.map((link) => [link, id])
  }

  function handleleave () {
    activeNodes = []
    activeEdges = []
  }

  function generateLinks (aspects) {
    const links = []
    aspects.forEach(({ x: x1, y: y1, links }) => {
      links.forEach((link) => {
        const { x: x2, y: y2 } = aspects.find((node) => node.id === link)
        links.push({
          x1,
          y1,
          x2,
          y2
        })
      })
    })
    console.log({ aspects, links })
    return links
  }

  onMount (async () => {
    resize()
    fetch('/aspects.json')
      .then(res => res.json())
      .then(data => {
        nodes = data
      });
  })

  $: x = scalePoint()
    .domain(range(nodes.length))
    .range([margin, width - margin]);

  $: aspects = map(nodes, (node) => {
    return {
      ...node,
      x: x(node.index),
      y: height / 2
    }
  })

  $: links = generateLinks(aspects)

  function resize() {
    ({ width, height } = svg.getBoundingClientRect());
  }
</script>

<svelte:window on:resize='{resize}'/>

<svg bind:this={svg} class="map" class:hasActive={activeEdges.length || activeNodes.length}>
  {#each aspects as { x, y, title, group, links, id }, i}
  <g on:mouseover={() => handleover([id, ...links], id)} on:mouseleave={handleleave} class:isActive={activeNodes.includes(id)} transform={`rotate(-90, ${x}, ${y})`}>
    <a xlink:href={`#${id}`}>
      <title>Jump to {title}</title>
      <text x={x} y={y} class="label" text-anchor="middle" dominant-baseline="middle">{ title }</text>
    </a>
  </g>
  {/each}
</svg>
