<script setup>
import { reactive } from 'vue'
import DataTable from './DataTable.vue'
import wexiv from './wasm/wexiv.js'

const name = "wexiv"
const fileName = reactive({ name: "" })

const preview = reactive({ url: "favicon.ico" })
const metaData = reactive(new Map())

function filezzz(e) {
  const target = e.target
  const file = target.files.item(0)
  const src = URL.createObjectURL(file)
  preview.url = src
  fileName.name = file.name
}

function clearIcon() {
  let icons = document.getElementById('copy')
  let icon1 = icons.querySelector("svg > path:nth-of-type(1)")
  if (!icon1.classList.contains('hidden')) icon1.classList.toggle("hidden")
  let icon2 = icons.querySelector("svg > path:nth-of-type(2)")
  if (!icon2.classList.contains('hidden')) icon2.classList.toggle("hidden")
}

function getIndex() {
  try {
    let req = indexedDB.open(name, 3)

    req.onerror = (e) => {
      console.error(e)
    }

    req.onsuccess = (e) => {
      let transaction = req.result.transaction(name, 'readonly')
      transaction.onerror = function (err) {
        console.error(err)
      }

      let store = transaction.objectStore(name)
      let all = store.getAll()
      all.onerror = function (err) {
        throw err
      }
      all.onsuccess = function (ev) {
        all.result.forEach((element) => {
          metaData.set(element.name, element)
        });
        let icons = document.getElementById('view')
        let icon1 = icons.querySelector("svg > path:nth-of-type(1)")
        if (!icon1.classList.contains('hidden')) icon1.classList.toggle("hidden")
        let icon2 = icons.querySelector("svg > path:nth-of-type(2)")
        if (icon2.classList.contains('hidden')) icon2.classList.toggle("hidden")
      }
    }
  } catch (e) {
    let icons = document.getElementById('view')
    let icon2 = icons.querySelector("svg > path:nth-of-type(1)")
    if (!icon2.classList.contains('hidden')) icon2.classList.toggle("hidden")
    let icon1 = icons.querySelector("svg > path:nth-of-type(1)")
    if (icon1.classList.contains('hidden')) icon1.classList.toggle("hidden")
    console.error(e)
  }
}

function clearIndex() {
  if (!confirm("All metadata storage will be deleted")) {
    return
  }
  try {
    let req = indexedDB.open(name, 3)
    req.onerror = (e) => {
      console.error(e)
      return
    }

    req.onsuccess = (e) => {
      let transaction = req.result.transaction(name, 'readwrite')
      transaction.onerror = (err) => {
        console.error(err)
      }

      let store = transaction.objectStore(name)
      var keyRangeAlpha = IDBKeyRange.bound("A", "Z")
      var keyRangeNumber = IDBKeyRange.bound("0", "9")
      let all = store.delete(keyRangeAlpha)
      all.onerror = (err) => {
        throw err
      }
      all.onsuccess = (ev) => {
        metaData.clear()
      }
      all = store.delete(keyRangeNumber)
      location.reload()
    }
  } catch (e) {
    console.error(e)
  }
}

function meta() {
  let icons = document.getElementById('copy')
  wexiv().then((acc, rej) => {
    if (rej) throw rej
    const files = document.getElementById('files')
    const file = files.files.item(0)
    if (file) {
      file.arrayBuffer().then((ab) => {
        try {
          const tmp = new Uint8Array(ab)
          const numBytes = tmp.length * tmp.BYTES_PER_ELEMENT
          const ptr = acc._malloc(numBytes)
          let heapBytes = acc.HEAPU8.subarray(ptr, ptr + numBytes)
          heapBytes.set(tmp)
          const nameBytesUTF8 = acc.lengthBytesUTF8(file.name)
          const namePtr = acc._malloc(nameBytesUTF8)
          acc.stringToUTF8(file.name, namePtr, namePtr + nameBytesUTF8)
          if (acc._getmeta(heapBytes.byteOffset, tmp.length, namePtr) !== 0) {
            throw "NOT Get Meta"
          }
          acc._free(heapBytes.byteOffset)
          acc._free(namePtr)
          let icon1 = icons.querySelector("svg > path:nth-of-type(1)")
          if (!icon1.classList.contains('hidden')) icon1.classList.toggle("hidden")
          let icon2 = icons.querySelector("svg > path:nth-of-type(2)")
          if (icon2.classList.contains('hidden')) icon2.classList.toggle("hidden")
          icons.classList.add('steppin')
        } catch (e) {
          throw e
        }
      })
    }
  }).catch((e) => {
    let icon2 = icons.querySelector("svg > path:nth-of-type(2)")
    if (!icon2.classList.contains('hidden')) icon2.classList.toggle("hidden")
    let icon1 = icons.querySelector("svg > path:nth-of-type(1)")
    if (icon1.classList.contains('hidden')) icon1.classList.toggle("hidden")
    console.error(e)
  })
  if (icons.classList.contains('steppin')) icons.classList.remove('steppin')
}

</script>

<style>
.steppin {
  position: relative;
  -moz-animation: mainFadeIn 2s linear infinite;
  -webkit-animation: mainFadeIn 2s linear infinite;
  -o-animation: mainFadeIn 2s linear infinite;
  animation: mainFadeIn 2s linear 1;
}

@keyframes mainFadeIn {
  0% {
    left: 3px;
  }

  50% {
    left: -3px;
  }

  100% {
    left: 0px;
  }
}
</style>


<template>
  <div class="grid grid-flow-row gap-3">
    <div class="align-middle py-3">
      1
      <label for="files" :onclick="clearIcon"
        class="px-5 py-2.5 rounded-lg border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700">
        Choose File
      </label>
      <input id="files" name="files" type="file" accept="image/*" :onchange="filezzz" hidden />
    </div>
    <div class="flex">
      <div class="align-middle py-1.5">
        2
        <button type="button"
          class="py-2.5 px-5 mb-2 text-sm font-medium text-gray-400 rounded-lg border border-gray-600 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 hover:text-white hover:bg-gray-700"
          :onclick="meta">Copy Metadata</button>
        <br />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" id="copy" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" stroke="red" class="hidden"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke="green" class="hidden"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
    </div>

    <div>
      <p>{{ fileName.name }}</p>
      <img :src="preview.url" class="object-contain" />
    </div>
    <div class="flex">
      <div class="align-middle py-1.5">
        3
        <button type="button"
          class="py-2.5 px-5 mb-2 text-sm font-medium text-gray-400 rounded-lg border border-gray-600 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 hover:text-white hover:bg-gray-700"
          :onclick="getIndex">View Metadata</button>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" id="view" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" stroke="red" class="hidden"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke="green" class="hidden"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    </div>
    <div id="datatable">
      <data-table v-if="metaData.size > 0" :rows="[...metaData.values()]" />
    </div>
  </div>
  <div class="relative bottom-0 mt-20">
    <button type="button"
      class="px-5 py-2.5 rounded-lg border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
      @click="clearIndex">Clear Metadata Storage</button>
  </div>
</template>
