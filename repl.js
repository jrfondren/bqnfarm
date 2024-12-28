let pagebqn = bqn('•ReBQN {repl⇐"loose"}')
;(function() {
  let runs = document.querySelectorAll('.bqnrun')
  let results = document.querySelectorAll('.bqnres')
  if (runs.length==0) return

  let running = 0
  let disp = t => { results[running].textContent += "\n" + t }
  sysvals.show = (x,w) => { disp(fmt(x)); return x; }
  sysvals.out  = (x,w) => { disp(req1str("•Out",x,w)); return x; }
  for (let i = 0; i < runs.length; i++) {
    runs[i].addEventListener('contextmenu', ev => {
      // interesting option: with highlighting, allows right-clicking dirctly on distinct parts of code to evaluate it
      //const src = ev.target.innerText
      const src = document.querySelectorAll('.bqnrun')[i].innerText
      ev.preventDefault()
      running = i
      try {
        // need 'out' set separately to avoid appending to pre-execution results[i]
        let out = runs[i].classList.contains("norebqn") ? fmt(bqn(str(src))) : fmt(pagebqn(str(src)))
        results[i].textContent += "\n" + out
      } catch(e) {
        let out = fmtErr(e)
        results[i].textContent += "\n" + out
      }
    })
    results[i].addEventListener('contextmenu', ev => {
      ev.preventDefault()
      results[i].textContent = ''
    })
  }
})()

sysvals.hashmap = ((x,w) => {
  let hm = new Map()
  let ns = 0
  let count = (x,w) => {
    if (has(w)) throw Error("•HashMap.Count: Takes one argument")
    return hm.size
  }
  let hkeys = (x,w) => {
    if (has(w)) throw Error("•HashMap.Keys: Takes one argument")
    return list(Array.from(hm.keys()))
  }
  let hvalues = (x,w) => {
    if (has(w)) throw Error("•HashMap.Values: Takes one argument")
    return list(Array.from(hm.values()))
  }
  let hhas = (x,w) => {
    if (has(w)) throw Error("•HashMap.Has: Takes one argument")
    return hm.has(x) ? 1 : 0
  }
  let hget = (x,w) => {
    if (!has(x)) throw Error("•HashMap.Get: Takes one or two arguments")
    let r = hm.get(x)
    if (r === undefined) {
      if (!has(w)) throw Error("•HashMap.Get: Key not found")
      return w
    }
    return r
  }
  let hset = (x,w) => {
    if (!has(w)) throw Error("•HashMap.Set: Takes two arguments")
    hm.set(w, x)
    return ns
  }
  let hdelete = (x,w) => {
    if (has(w)) throw Error("•HashMap.Delete: Takes one argument")
    if (!hm.has(x)) throw Error("•HashMap.Delete: key not found")
    hm.delete(x)
    return ns
  }
  ns = makens(["count","keys","values","has","get","set","delete"], [count,hkeys,hvalues,hhas,hget,hset,hdelete])
  return ns
})
