<script>
  import { onMount } from 'svelte';
  import { scalePoint, scaleLinear } from 'd3-scale';
  import range from 'lodash/range';
  import map from 'lodash/map';
  import uniqBy from 'lodash/uniqBy';

  const TOPICS = ['material', 'power', 'bodies']

  let width = 0;
  let height = 0;
  const margin = {
    v: [20, 60],
    h: [20, 60]
  };
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

  function between (v, max, min) {
    // Makes sure the curve does not get outside the area
    return Math.max(Math.min(v, max), min)
  }

  function getBezier (y1, y2, i, a) {
    if (i) {
      // If the curve goes below, we use the smaller y-value
      // And subtract the x-distance to get nice curves
      return Math.min(y1, y2) - a
    } else {
      // If the curve goes above, we use the higher y-value
      // And add the x-distance to get nice curves
      return Math.max(y1, y2) + a
    }
  }

  function generateArc (x1, x2, y1, y2, i) {
    const a = Math.max(Math.abs(x1 - x2), mv) // Calculate this to get the x-distance, but use at least the current vertical margin
    const _y = between(getBezier(y1, y2, i, a), height, 0) // We make sure the curve does not get outside the area
    return `M${x1} ${y1} C${x1} ${_y}, ${x2} ${_y}, ${x2} ${y2}`
  }

  function generateLinks (arr) {
    const links = []
    // console.log({ arr })
    arr.forEach(({ x: x1, y: y1, links: keys, id }) => {
      keys.forEach((key, i) => {
        // console.log({ arr, key })
        const datum = arr.find((node) => node.id === key)
        if (datum) {
          const { x: x2, y: y2 } = datum
          links.push({
            source: id,
            target: key,
            d: generateArc(x1, x2, y1, y2, i % 2)
          })
        } else {
          console.log(`Error in Aspect ${id} to link ${key}`)
        }
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

  // Margin vertical
  $: mVertical = scaleLinear()
    .domain([500, 1000])
    .range([margin.v[1], margin.v[0]]);

  $: mv = between(mVertical(width), margin.v[1], margin.v[0])

  // Margin horizonzal
  $: mHorizontal = scaleLinear()
    .domain([500, 1000])
    .range([margin.h[0], margin.h[1]]);

  $: mh = between(mHorizontal(width), margin.h[1], margin.h[0])

  $: y = scalePoint()
    .domain(range(nodes.length))
    .range([mv, height - mv]);

  $: x = scalePoint()
    .domain(range(nodes.length))
    .range([mh, width - mh]);

  // Rotation
  $: r = scaleLinear()
    .domain([500, 1000])
    .range([90, 0]);

  // Based on the width and maximum value of 90 and minimum value of 0
  $: rotate = between(r(width), 90, 0)

  $: aspects = map(nodes, (node) => {
    return {
      ...node,
      x: x(node.index),
      y: y(node.index)
    }
  })

  $: links = generateLinks(aspects)

  function resize() {
    ({ width, height } = svg.getBoundingClientRect());
  }

  function scrollTo (id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }
</script>

<svelte:window on:resize='{resize}'/>

<ul class="map-topics">
  {#each TOPICS as topic}
  <li on:mouseover={() => handleoverTopic(topic)} on:mouseleave={handleleaveTopic}>{ topic }</li>
  {/each}
</ul>

<svg bind:this={svg} class="map" class:hasActive={activeEdges.length || activeNodes.length || activeTopic}>
  <g>
    {#each links as { x1, x2, source, target, d }}
    <path d={d} class="edge" class:isActive={activeEdges.some((edge) => { return edge[1] === source && edge[0] === target })} />
    {/each}
  </g>
  <g>
    {#each aspects as { x, y, title, group, links, id, topics }}
    <a
      href="#{id}"
      on:click|preventDefault={() => scrollTo(id)}
      on:mouseover={() => handleoverAspect([id, ...links], id)}
      on:mouseleave={handleleaveAspect}
      class:isActive={activeNodes.includes(id) || (activeTopic && topics.includes(activeTopic))}
      style={`transform: rotate(-${rotate}deg); transform-origin: ${x}px ${y}px;`}>
      <title>Jump to aspect »{title}«</title>
      <text x={x} y={y} class="label" text-anchor="middle" dominant-baseline="middle">{ title }</text>
    </a>
    {/each}
  </g>
</svg>
