<script>
  import { onMount } from 'svelte';
  import { scalePoint } from 'd3-scale';
  import range from 'lodash/range';
  import map from 'lodash/map';
  import uniqBy from 'lodash/uniqBy';

  const TOPICS = ['material', 'power', 'bodies']

  let width = 0;
  let height = 0;
  const margin = 20;
  let svg;

  let nodes = [];
  const edges = [];
  let activeNodes = [];
  let activeEdges = [];
  let activeTopic;

  function handleoverAspect (links, id) {
    activeNodes = links
    activeEdges = links.map((link) => [link, id])
  }

  function handleleaveAspect () {
    activeNodes = []
    activeEdges = []
  }

  function handleoverTopic (topic) {
    activeTopic = topic
  }

  function handleleaveTopic () {
    activeTopic = null
  }

  function generateArc (x1, x2, i) {
    const _y = i ? y / 4 : height - y / 4
    return `M${x1} ${y} C${x1} ${_y}, ${x2} ${_y}, ${x2} ${y}`
  }

  function generateLinks (arr) {
    const links = []
    arr.forEach(({ x: x1, links: keys, id }) => {
      keys.forEach((key, i) => {
        const { x: x2 } = arr.find((node) => node.id === key)
        links.push({
          source: id,
          target: key,
          d: generateArc(x1, x2, i % 2)
        })
      })
    })
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
      x: x(node.index)
    }
  })

  $: links = generateLinks(aspects)

  $: y = height / 2

  function resize() {
    ({ width, height } = svg.getBoundingClientRect());
  }
</script>

<svelte:window on:resize='{resize}'/>

<ul class="map-topics">
  {#each TOPICS as topic}
  <li on:mouseover={() => handleoverTopic(topic)} on:mouseleave={handleleaveTopic}>{ topic }</li>
  {/each}
</ul>

<svg bind:this={svg} class="map" class:hasActive={activeEdges.length || activeNodes.length || activeTopic}>
  {#each links as { x1, x2, source, target, d }}
  <path d={d} class:isActive={activeEdges.some((edge) => { return edge[1] === source && edge[0] === target })} />
  {/each}
  {#each aspects as { x, title, group, links, id, topics }}
  <g on:mouseover={() => handleoverAspect([id, ...links], id)} on:mouseleave={handleleaveAspect} class:isActive={activeNodes.includes(id) || (activeTopic && topics.includes(activeTopic))} transform={`rotate(-90, ${x}, ${y})`}>
    <a xlink:href={`#${id}`}>
      <title>Jump to aspect »{title}«</title>
      <text x={x} y={y} class="label" text-anchor="middle" dominant-baseline="middle">{ title }</text>
    </a>
  </g>
  {/each}
</svg>
