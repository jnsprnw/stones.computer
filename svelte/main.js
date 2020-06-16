import Table from './Table.svelte';

const targetTable = document.getElementById('table')
if (targetTable) new Table({ target: targetTable });
