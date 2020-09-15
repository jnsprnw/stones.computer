import Table from './Table.svelte';
const targetTable = document.getElementById('table')
if (targetTable) new Table({ target: targetTable });

import Map from './Map.svelte';
const targetMap = document.getElementById('map')
if (targetMap) new Map({ target: targetMap });

import Navigation from './Navigation.svelte';
const targetNavigation = document.getElementById('navigation')
if (targetNavigation) new Navigation({ target: targetNavigation });
