/**
 * Browser stub for Node built-ins (`node:fs/promises`, `node:path`, `node:crypto`,
 * `node:stream`, `node:util`). The Anthropic SDK's agent-toolset (file tools,
 * session worker) imports these, but that code never runs in the browser — we
 * only call `messages.create`. Vite can't bundle the real Node modules, so these
 * aliases let the dead code resolve. Anything actually invoked throws loudly.
 */
const notAvailable = (name: string) => () => {
  throw new Error(`[node-stub] "${name}" is not available in the browser`)
}

// node:crypto — randomUUID is real (Web Crypto) just in case something reaches it.
export const randomUUID = (): string =>
  globalThis.crypto?.randomUUID?.() ?? notAvailable('randomUUID')()

// node:stream / node:stream/promises / node:util
export class Readable {}
export const pipeline = notAvailable('pipeline')
export const promisify = (fn: unknown) => fn

// node:child_process
export const execFile = notAvailable('child_process.execFile')
export const exec = notAvailable('child_process.exec')
export const spawn = notAvailable('child_process.spawn')

// node:path
export const sep = '/'
export const delimiter = ':'
export const resolve = notAvailable('path.resolve')
export const dirname = notAvailable('path.dirname')
export const basename = notAvailable('path.basename')
export const join = notAvailable('path.join')
export const isAbsolute = notAvailable('path.isAbsolute')
export const normalize = notAvailable('path.normalize')
export const extname = notAvailable('path.extname')
export const relative = notAvailable('path.relative')
export const parse = notAvailable('path.parse')
export const format = notAvailable('path.format')
export const toNamespacedPath = notAvailable('path.toNamespacedPath')

// node:fs/promises
export const readFile = notAvailable('fs.readFile')
export const writeFile = notAvailable('fs.writeFile')
export const appendFile = notAvailable('fs.appendFile')
export const mkdir = notAvailable('fs.mkdir')
export const rm = notAvailable('fs.rm')
export const rmdir = notAvailable('fs.rmdir')
export const unlink = notAvailable('fs.unlink')
export const rename = notAvailable('fs.rename')
export const copyFile = notAvailable('fs.copyFile')
export const cp = notAvailable('fs.cp')
export const stat = notAvailable('fs.stat')
export const lstat = notAvailable('fs.lstat')
export const realpath = notAvailable('fs.realpath')
export const readlink = notAvailable('fs.readlink')
export const readdir = notAvailable('fs.readdir')
export const access = notAvailable('fs.access')
export const open = notAvailable('fs.open')
export const chmod = notAvailable('fs.chmod')
export const symlink = notAvailable('fs.symlink')
export const mkdtemp = notAvailable('fs.mkdtemp')
export const opendir = notAvailable('fs.opendir')

// node:fs (sync) — namespace members the agent-toolset touches.
export const constants = {}
export const existsSync = notAvailable('fs.existsSync')
export const createReadStream = notAvailable('fs.createReadStream')
export const createWriteStream = notAvailable('fs.createWriteStream')
export const readFileSync = notAvailable('fs.readFileSync')
export const writeFileSync = notAvailable('fs.writeFileSync')
export const statSync = notAvailable('fs.statSync')
export const lstatSync = notAvailable('fs.lstatSync')
export const mkdirSync = notAvailable('fs.mkdirSync')
export const readdirSync = notAvailable('fs.readdirSync')
export const rmSync = notAvailable('fs.rmSync')
export const unlinkSync = notAvailable('fs.unlinkSync')
export const realpathSync = notAvailable('fs.realpathSync')
export const glob = notAvailable('fs.glob')

// node:readline
export const createInterface = notAvailable('readline.createInterface')

export default {
  glob,
  createInterface,
  execFile,
  exec,
  spawn,
  constants,
  existsSync,
  createReadStream,
  createWriteStream,
  readFileSync,
  writeFileSync,
  statSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
  realpathSync,
  randomUUID,
  Readable,
  pipeline,
  promisify,
  sep,
  delimiter,
  resolve,
  dirname,
  basename,
  join,
  isAbsolute,
  normalize,
  extname,
  relative,
  parse,
  format,
  toNamespacedPath,
  readFile,
  writeFile,
  appendFile,
  mkdir,
  rm,
  rmdir,
  unlink,
  rename,
  copyFile,
  cp,
  stat,
  lstat,
  realpath,
  readlink,
  readdir,
  access,
  open,
  chmod,
  symlink,
  mkdtemp,
  opendir,
}
