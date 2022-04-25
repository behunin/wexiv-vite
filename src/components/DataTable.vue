<template>
    <div>
        <table class="table-fixed">
            <thead>
                <th>Name</th>
                <th>Exif</th>
                <th>IPTC</th>
                <th>XMP</th>
                <th>Extra</th>
            </thead>
            <tbody>
                <template v-for="(row, rowIndex) in tableRows" :key="rowIndex">
                    <tr class="bordere sm:h-12" @click="rowClickHandler(rowIndex)">
                        <td>
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
                        <td v-if="Object.keys(row.head).length !== 0">
                            <p class="mx-1">Present</p>
                        </td>
                        <td v-else>
                            <p class="mx-1">Empty</p>
                        </td>
                    </tr>
                    <tr :id="'row' + `${rowIndex}`" hidden>
                        <td></td>
                        <td v-html="prettyPrintJson.toHtml(row.exif)"></td>
                        <td v-html="prettyPrintJson.toHtml(row.iptc)"></td>
                        <td v-html="prettyPrintJson.toHtml(row.xmp)"></td>
                        <td v-html="prettyPrintJson.toHtml(row.head)"></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { prettyPrintJson } from './pretty-print-json.js';

const props = defineProps({
    rows: { type: Array, required: true }
})

const tableRows = computed(() => props.rows)

const rowClickHandler = (ev) => {
    const id = 'row' + `${ev}`
    let row = document.getElementById(id)
    row.hidden ? row.hidden = false : row.hidden = true
    if (!row.hidden) row.scrollIntoView()
}
</script>

<style>
.bordere {
    outline: 2px solid indigo;
    outline-offset: -5px;
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
