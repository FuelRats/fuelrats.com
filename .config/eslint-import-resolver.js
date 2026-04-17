/**
 * Custom eslint-plugin-import resolver that handles the ~ alias.
 * Replaces eslint-import-resolver-alias which crashes under Bun because
 * it relies on Node.js-internal Module._extensions.
 */
const path = require('path')
const fs = require('fs')

const EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs', '.json']
const ROOT = path.resolve(__dirname, '..')

exports.interfaceVersion = 2

exports.resolve = (source, file, config) => {
  const map = config?.map ?? []

  let resolved = source
  let aliased = false
  for (const [prefix, target] of map) {
    if (source === prefix || source.startsWith(`${prefix}/`)) {
      // Alias targets are relative to project root, not the source file
      resolved = path.resolve(ROOT, source.replace(prefix, target))
      aliased = true
      break
    }
  }

  if (aliased || resolved.startsWith('.') || resolved.startsWith('/')) {
    const base = resolved.startsWith('/')
      ? resolved
      : path.resolve(path.dirname(file), resolved)

    for (const attempt of [
      base,
      ...EXTENSIONS.map((ext) => { return base + ext }),
      ...EXTENSIONS.map((ext) => { return path.join(base, `index${ext}`) }),
    ]) {
      if (fs.existsSync(attempt)) {
        return { found: true, path: attempt }
      }
    }
  }

  // Fall through to node resolution
  try {
    const found = require.resolve(source, { paths: [path.dirname(file)] })
    return { found: true, path: found }
  } catch {
    return { found: false }
  }
}
