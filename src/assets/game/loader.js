/**
 * Arcade game loader
 *
 * Loads the Emscripten-compiled WASM game inside a given container element.
 * The glue code (index.js) is self-executing and expects:
 *   - a global `Module` object (we set it before the script runs)
 *   - a <canvas id="canvas"> in the DOM
 *   - `locateFile` to resolve the .wasm path (Vite hashes asset URLs)
 *
 * Returns a cleanup function that stops the main loop and removes the script.
 */

import wasmUrl from './index.wasm?url'
import glueSource from './index.js?raw'

let cleanup = null

export async function startGame(container) {
  if (cleanup) return // already running

  // Create the canvas the glue code expects
  const canvas = document.createElement('canvas')
  canvas.id = 'canvas'
  container.appendChild(canvas)

  // Set Module before the glue script reads it
  // (the glue starts with: var Module = typeof Module != "undefined" ? Module : {})
  window.Module = {
    canvas,
    noExitRuntime: true,
    locateFile: (path) => {
      if (path.endsWith('.wasm')) return wasmUrl
      return path
    },
  }

  // Load glue code via blob URL so Vite doesn't try to parse it as ESM
  const blob = new Blob([glueSource], { type: 'text/javascript' })
  const blobUrl = URL.createObjectURL(blob)
  const script = document.createElement('script')
  script.src = blobUrl
  document.head.appendChild(script)

  cleanup = () => {
    // Stop the Emscripten main loop
    try { window.Module?.pauseMainLoop?.() } catch {}
    // Remove injected elements
    script.remove()
    URL.revokeObjectURL(blobUrl)
    canvas.remove()
    // Reset body styles that js_init may have set
    document.body.style.background = ''
    document.body.style.margin = ''
    document.body.style.display = ''
    document.body.style.flexDirection = ''
    document.body.style.alignItems = ''
    document.body.style.justifyContent = ''
    document.body.style.minHeight = ''
    document.body.style.color = ''
    document.body.style.fontFamily = ''
    window.Module = undefined
  }
}

export function stopGame() {
  if (cleanup) {
    cleanup()
    cleanup = null
  }
}
