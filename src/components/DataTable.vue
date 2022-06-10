<script setup>
import { computed, onUpdated, onMounted } from 'vue'
import { prettyPrintJson } from './pretty-print-json.js';

const scrollText = 'scroll-text'

const emit = defineEmits(['rowname'])

const props = defineProps({
    rows: { type: Array, required: true }
})

const tableRows = computed(() => props.rows)

onMounted(() => {
    for (let i = 0; i < props.rows.length; i++) {
        const el = document.getElementById('name' + i)
        const child = el.firstChild
        if (child.clientWidth < child.scrollWidth) {
            child.classList.add(scrollText)
        }
    }
})

onUpdated(() => {
    for (let i = 0; i < props.rows.length; i++) {
        const el = document.getElementById('name' + i)
        const child = el.firstChild
        if (child.clientWidth < child.scrollWidth) {
            child.classList.add(scrollText)
        } else if (child.classList.contains(scrollText)) {
            child.classList.remove(scrollText)
        }
    }
})

const rowClickHandler = (idx) => {
    const id = 'row' + `${idx}`
    let row = document.getElementById(id)
    row.hidden ? row.hidden = false : row.hidden = true
    if (!row.hidden) row.scrollIntoView()
}

function deleteIndex(rowName) {
    emit('rowname', rowName);
}
</script>

<style>
.scroll-text {
    /* animation properties */
    -moz-transform: translateX(1%);
    -webkit-transform: translateX(1%);
    transform: translateX(1%);

    -moz-animation: my-animation 25s linear infinite;
    -webkit-animation: my-animation 25s linear infinite;
    animation: my-animation 25s linear infinite;
}

/* for Firefox */
@-moz-keyframes my-animation {
    from {
        -moz-transform: translateX(1%);
    }

    to {
        -moz-transform: translateX(-100%);
    }
}

/* for Chrome */
@-webkit-keyframes my-animation {
    from {
        -webkit-transform: translateX(1%);
    }

    to {
        -webkit-transform: translateX(-100%);
    }
}

@keyframes my-animation {
    from {
        -moz-transform: translateX(1%);
        -webkit-transform: translateX(1%);
        transform: translateX(1%);
    }

    to {
        -moz-transform: translateX(-100%);
        -webkit-transform: translateX(-100%);
        transform: translateX(-100%);
    }
}

.bordere {
    outline: 2px solid indigo;
    outline-offset: -3px;
    background-color: #333;
}

tr.hide-table-padding td {
    padding: 0;
}

th {
    text-align: left;
}

table,
th,
td {
    border: 1px solid;
}

td {
    max-width: 50em;
    min-width: 3em;
    overflow-wrap: break-word;
}

tr {
    vertical-align: top;
    text-align: left;
}

tr:active {
    outline-color: yellowgreen;
}

tr:hover {
    outline-color: blanchedalmond;
}

/*! pretty-print-json v1.2.3 ~~ https://pretty-print-json.js.org ~~ MIT License */

/* Layout */
.json-container {
    font-family: menlo, consolas, monospace;
    font-style: normal;
    font-weight: bold;
    line-height: 1.4em;
    font-size: 0.9rem;
    transition: background-color 400ms;
}

a.json-link {
    text-decoration: none;
    border-bottom: 1px solid;
    outline: none;
}

a.json-link:hover {
    background-color: transparent;
    outline: none;
}

ol.json-lines {
    white-space: normal;
    padding-inline-start: 3em;
    margin: 0px;
}

ol.json-lines>li {
    white-space: pre;
    text-indent: 0.7em;
    line-height: 1.5em;
    padding: 0px;
}

ol.json-lines>li::marker {
    font-family: system-ui, sans-serif;
    font-weight: normal;
}

.json-key,
.json-string,
.json-number,
.json-boolean,
.json-null,
.json-mark,
a.json-link,
ol.json-lines>li {
    transition: all 400ms;
}

/* Dark Mode */
.json-container {
    background-color: black;
}

.json-key {
    color: indianred;
}

.json-string {
    color: darkkhaki;
}

.json-number {
    color: deepskyblue;
}

.json-boolean {
    color: mediumseagreen;
}

.json-null {
    color: darkorange;
}

.json-mark {
    color: silver;
}

a.json-link {
    color: mediumorchid;
}

a.json-link:visited {
    color: slategray;
}

a.json-link:hover {
    color: violet;
}

a.json-link:active {
    color: slategray;
}

ol.json-lines>li::marker {
    color: silver;
}

ol.json-lines>li:nth-child(odd) {
    background-color: #222222;
}

ol.json-lines>li:nth-child(even) {
    background-color: #161616;
}

ol.json-lines>li:hover {
    background-color: dimgray;
}
</style>

<template>
    <div>
        <table class="table-fixed w-full">
            <thead class="align-center">
                <th>Name</th>
                <th>Exif</th>
                <th>IPTC</th>
                <th>XMP</th>
            </thead>
            <tbody>
                <template v-for="(row, rowIndex) in tableRows" :key="rowIndex">
                    <tr class="bordere sm:h-12 align-middle whitespace-pre overflow-hidden"
                        @click="rowClickHandler(rowIndex)">
                        <td :id="'name' + rowIndex" class="overflow-hidden">
                            <p class="mx-1">{{ row.name }}</p>
                        </td>
                        <td v-if="Object.keys(row.exif).length !== 0">
                            <p class="mx-1">Present</p>
                        </td>
                        <td v-else>
                            <p class="mx-1">Empty</p>
                        </td>
                        <td v-if="Object.keys(row.iptc).length !== 0">
                            <p class="mx-1">Present</p>
                        </td>
                        <td v-else>
                            <p class="mx-1">Empty</p>
                        </td>
                        <td v-if="Object.keys(row.xmp).length !== 0">
                            <p class="mx-1">Present</p>
                        </td>
                        <td v-else>
                            <p class="mx-1">Empty</p>
                        </td>
                    </tr>
                    <tr :id="'row' + rowIndex" class="whitespace-pre-wrap" hidden>
                        <td>
                            <button class="flex" @click="rowClickHandler(rowIndex); deleteIndex(row.name);">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="red" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                            </button>

                        </td>
                        <td v-html="prettyPrintJson.toHtml(row.exif)"></td>
                        <td v-html="prettyPrintJson.toHtml(row.iptc)"></td>
                        <td v-html="prettyPrintJson.toHtml(row.xmp)"></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
