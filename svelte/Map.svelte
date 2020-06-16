<script>
  import { onMount } from 'svelte';
  import cola from 'webcola';
  import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force'

  let width = 0;
  let height = 0;
  let svg;

  let aspects = []; // All items
  let directLinks = [];
  let nodes = [];
  const edges = [];
  let activeNodes = [];
  let activeEdges = [];

  function ticked () {
    nodes.forEach((node) => {
      node.x = Math.max(60, Math.min(width - 60, node.x))
      node.y = Math.max(20, Math.min(height - 20, node.y))
    })
    aspects = nodes
    directLinks = edges.filter(({ direct }) => direct)
  }

  // const simulation = new cola.Layout()
  //   .avoidOverlaps(true)
  //   .on("tick", ticked)
  //   .size([width, height])
  //   .linkDistance(function (l) { return l.weight * 60 })

  const simulation = forceSimulation()
    // .force("charge", forceManyBody().strength(-50))
    .force("collide", forceCollide().radius(60))
    .on("tick", ticked)

  // const simulation = new cola.Layout()
  //   .avoidOverlaps(true)
  //   .on("tick", ticked)
  //   .size([width, height])
  //   .linkDistance(function (l) { return l.weight * 60 })

  function handleover (links, id) {
    activeNodes = links
    activeEdges = links.map((link) => [link, id])
  }

  function handleleave () {
    activeNodes = []
    activeEdges = []
  }

  onMount (async () => {
    resize()
    fetch('/aspects.json')
      .then(res => res.json())
      .then(data => {
        nodes = data.map((d) => {
          return {
            ...d,
            width: 250,
            height: 25
          }
        });

        // Direct links
        nodes.forEach(({ id, links }) => {
          links.forEach((link) => {
            const target = nodes.find((node) => {
              return node.id === link
            })
            edges.push({ source: id, target: target.id, direct: true, weight: 0.5 })
          })
        })

        // Same topic
        nodes.forEach(({ id, topics }) => {
          topics.forEach((topic) => {
            const targets = nodes.filter((node) => {
              return node.topics.includes(topic) && node.id !== id
            })
            targets.forEach((target) => {
              edges.push({ source: id, target: target.id, weight: 0.2 })
            })
          })
        })

        // Same group
        nodes.forEach(({ id, group }) => {
          const targets = nodes.filter((node) => {
            return node.group === group && node.id !== id
          })
          targets.forEach((target) => {
            edges.push({ source: id, target: target.id, weight: 0.5, group: true })
          })
        })

        simulation
          .nodes(nodes)

        simulation.force("link", forceLink(edges).id(({ id }) => id).distance(15).strength(({ weight }) => weight))
      });
  })

  function resize() {
    ({ width, height } = svg.getBoundingClientRect());
    simulation.force("center", forceCenter(width / 2, height / 2))
    // simulation.start();
  }
</script>

<svelte:window on:resize='{resize}'/>

<svg bind:this={svg} class="map" class:hasActive={activeEdges.length || activeNodes.length}>
  {#each directLinks as { source, target }, i}
  <line x1={source.x} x2={target.x} y1={source.y} y2={target.y} class:isActive={activeEdges.some((edge) => { return (edge[0] === source.id && edge[1] === target.id) || (edge[1] === source.id && edge[0] === target.id) })} />
  {/each}
  {#each aspects as { x, y, title, group, links, id }, i}
  <g on:mouseover={() => handleover([id, ...links], id)} on:mouseleave={handleleave} class:isActive={activeNodes.includes(id)}>
    <text x={x} y={y} class="label" text-anchor="middle">{ title }</text>
  </g>
  {/each}
</svg>
