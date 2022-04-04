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

function getIndex() {
  try {
    let req = indexedDB.open(name, 2)

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
        console.error(err)
      }
      all.onsuccess = function (ev) {
        all.result.forEach((element) => {
          metaData.set(element.name, element)
        });
      }
    }
  } catch (e) {
    console.error(e)
  }

  const table = document.getElementById('datatable')
  table.scrollIntoView()
}

function clearIndex() {
  if (!confirm("All metadata storage will be deleted")) {
    return
  }
  try {
    let req = indexedDB.open(name, 2)
  } catch (e) {
    console.error(e)
  }

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
    var keyRangeValue = IDBKeyRange.bound("A", "Z");
    let all = store.delete(keyRangeValue)
    all.onerror = (err) => {
      console.error(err)
    }
    all.onsuccess = (ev) => {
      metaData.clear()
      location.reload()
    }
  }
}

function meta() {
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
            console.error("NOT Get Meta")
          }
          acc._free(heapBytes.byteOffset)
          acc._free(namePtr)
        } catch (e) {
          console.error(e)
        }
      })
    }
  }).catch((e) => {
    console.error(e)
  })

  const table = document.getElementById('datatable')
  table.scrollIntoView()
}

</script>


<template>
  <div class="grid grid-flow-row gap-3">
    <p>1.</p>
    <div>
      <label
        for="files"
        class="px-5 py-2.5 rounded-lg border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
      >Choose File</label>
      <input id="files" name="files" type="file" accept="image/*" :onchange="filezzz" hidden />
    </div>
    <p>2.</p>
    <div>
      <button
        type="button"
        class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-400 rounded-lg border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 hover:text-white hover:bg-gray-700"
        :onclick="meta"
      >Store Meta</button>
      <br />
    </div>
    <div>
      <p>{{ fileName.name }}</p>
      <img :src="preview.url" />
    </div>
    <div id="datatable">
      <p>3.</p>
      <button
        type="button"
        class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-400 rounded-lg border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 hover:text-white hover:bg-gray-700"
        :onclick="getIndex"
      >Get Meta</button>
      <data-table v-if="metaData.size > 0" :rows="[...metaData.values()]" />
    </div>
  </div>
  <div class="relative bottom-0 mt-3">
    <button
      type="button"
      class="px-5 py-2.5 rounded-lg border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
      @click="clearIndex"
    >Clear Metadata Storage</button>
  </div>
</template>
