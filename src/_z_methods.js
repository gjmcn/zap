const createArray = ['_create', '_createElm'];

export default {

  // ----- helpers -----

  _first(i) {
    return (typeof i === 'string')
      ? document.querySelector(i)
      : i && i[Symbol.iterator]
        ? i[Symbol.iterator]().next().value
        : i;
  },

  _autoSelect(e) {
    return (typeof e === 'string')
      ? [...document.querySelectorAll(e)]
      : e;
  },

  _group(c, i, f, g) {
    let m = new Map(),
        j = 0;
    for (let v of i) {
      let k = f(v, j++, i);
      c ? m.set(k, m.has(k) ? m.get(k) + 1 : 1)
        : (m.has(k) ? m.get(k).push(v) : m.set(k, [v]));
    }
    if (g !== void 0) {
      for (let [k, v] of m) {
        m.set(k, g(v, k));
      }
    }
    return m;
  },

  _bin(c, i, z, f = (x, y) => x - y, g) {
    z = [...z];
    let m = new Map();
    for (let q of z) {
      m.set(q, c ? 0 : []);
    }
    for (let v of i) {
      for (let q of z) {
        if (f(v, q) <= 0) {
          c ? m.set(q, m.get(q) + 1)
            : m.get(q).push(v);
          break;
        }
      }
    }
    if (g !== void 0) {
      for (let [q, v] of m) {
        m.set(q, g(v, q));
      }
    }
    return m;
  },

  _sum(m, i, f) {
    let s = 0,
        j = 0;
    for (let v of i) {
      s += +(f === void 0 ? v : f(v, j, i));
      j++;
    }
    return m ? s / j : s;
  },

  _minMaxIndex(x, i, f) {
    let s = NaN,
        j = 0,
        k = -1,
        g = x ? ((q, w) => q <= w) : ((q, w) => q >= w);
    for (let v of i) {
      v = +(f === void 0 ? v : f(v, j, i));
      if (isNaN(v)) return -1;
      if (!g(v, s)) {
        s = v;
        k = j;
      };
      j++;
    }
    return k;
  },

  _minMax(x, i, f) {
    let s = NaN,
        j = 0,
        g = x ? ((q, w) => q <= w) : ((q, w) => q >= w),
        e; 
    for (let v of i) {
      let t = +(f === void 0 ? v : f(v, j++, i));
      if (isNaN(t)) return;
      if (!g(t, s)) {
        s = t; 
        e = v;
      }
    }
    return e;
  },

  _varDev(q, i, f) {
    let c = 0,
        m = 0,
        s = 0,
        d;
    for (let v of i) {
      v = +(f === void 0 ? v : f(v, c, i));
      d = v - m;
      m += d / ++c;
      s += d * (v - m);
    }
    if (c < 2) return NaN;
    s = s / (c - 1);
    return q ? Math.sqrt(s) : s;
  },

  _random(j, k) {
    return Math.random() * (k - j) + j;
  },

  _randomInt(j, k) {
    j = Math.floor(j);
    k = Math.floor(k);
    return Math.floor(Math.random() * (k - j)) + j;
  },

  _categorical(q, c) {
    const v = Math.random() * c;
    for (var j = 0; j < q.length - 1; j++) {
      if (v < q[j]) return j;
    }
    return j;
  },

  _normal(m, d, e) {
    let q = null;
    return () => {
      let r;
      if (q === null) {
        let u, v, s;
        do {
          u = Math.random() * 2 - 1;
          v = Math.random() * 2 - 1;
          s = u * u + v * v;
        } while (s >= 1 || !s);
        s = Math.sqrt(-2 * Math.log(s) / s);
        q = v * s;
        r = m + d * u * s;
      }
      else {
        r = q * d + m;
        q = null;
      }
      return e ? Math.exp(r) : r;
    };
  },

  _binomial(m, p) {
    for (var s = 0, i = 0; i < m; i++) {
      s += Math.random() < p;
    }
    return s;
  },

  _exponential(r) {
    return -Math.log(1 - Math.random()) / r;
  },

  _geometric(p) {
    return 1 + Math.floor(Math.log(Math.random()) / Math.log(1 - p))
  },

  _sample(f, n, ...a) {
    let r;
    if (n === undefined) {
      r = f(...a);
    }
    else {
      r = [];
      for (let i = 0; i < n; i++) {
        r.push(f(...a));
      }
    }
    return r;
  },

  _ew(x, f) {
    let r;
    if (typeof x !== 'string' && x && x[Symbol.iterator]) {
      r = [];
      for (let v of x) r.push(f(v));
    }
    else {
      r = f(x);
    }
    return r;
  },

  _encode(s, x, t, a = true) {
    let e = [];
    for (let v of x) {
      let q = s
        ? document.createElementNS('http://www.w3.org/2000/svg', t)
        : document.createElement(t);
      if (a) q.__data__ = v;
      e.push(q);
    }
    return e;
  },

  _createElm(s, t) {
    return s
      ? document.createElementNS('http://www.w3.org/2000/svg', t)
      : document.createElement(t);
  },

  _create(s, t, n) {
    let r;
    if (n === undefined) {
      r = this._createElm(s, t);
    }
    else {
      r = [];
      for (let j = 0; j < n; j++) {
        r.push(this._createElm(s, t));       
      }
    }
    return r;
  },

  _getAttr(e, q)  { return e.getAttribute(q) },
  _getProp(e, q)  { return e[q] },
  _getStyle(e, q) { return window.getComputedStyle(e).getPropertyValue(q) },

  _apsGet(f, e, a) {
    let r;
    if (typeof e === 'string') e = document.querySelectorAll(e);
    if (e && e[Symbol.iterator]) {
      r = [];
      for (let y of e) {
        r.push(f(y, a));
      }
    }
    else {
      r = f(e, a);
    }
    return r;
  },

  _setAttr(e, q, v)  { e.setAttribute(q, v) },
  _setProp(e, q, v)  { e[q] = v },
  _setStyle(e, q, v) { e.style.setProperty(q, v) },

  _apsSet(f, e, a, v) {
    let j = 0;
    e = this._autoSelect(e);
    for (let q of (e && e[Symbol.iterator] ? e : [e])) {
      f(q, a, (typeof v === "function" ? v.call(q, q.__data__, j++) : v));
    };
    return e;
  },


  // ----- call directly as _z_ methods in generated code -----

  *to(s, e, j = 1) {
    j = +j, s = +s, e = +e;
    e += (e - s) * 1e-14;
    while (j > 0 ? s < e : s > e) {
      yield s;
      s += j;
    }
  },

  *linSpace(s, e, n) {
    if ((n = +n) === 1) yield (+s + +e) / 2;
    else {
      const j = (+e - +s) / (n - 1);
      s = +s - j;
      for (let i = 0; i < n; i++) yield s += j;
    }
  },

  *seq(v, t, u) {
    while (t(v)) {
      yield v;
      v = u(v);
    }
  },

  *while(f) {
    while (f()) yield;
  },

  *do(f) {
    while (1) yield f();
  },

  print(v) {
    console.log(v);
    return v;
  },

  get(o, p, f) {
    return Object.defineProperty(o, p, {
      get: f,
      configurable: true,
      enumerable: true
    });
  },

  set(o, p, f) {
    return Object.defineProperty(o, p, {
      set: f,
      configurable: true,
      enumerable: true
    });
  },

  reduce(i, f, q) {
    let j = 0;
    for (let v of i) {
      q = f(q, v, j++, i);
    }
    return q;
  },

  group(i, f, g) { return this._group(false, i, f, g) },
  groupUse: ['_group'],

  groupCount(i, f, g) { return this._group(true, i, f, g) },
  groupCountUse: ['_group'],

  bin(i, z, f, g) { return this._bin(false, i, z, f, g) },
  binUse: ['_bin'],

  binCount(i, z, f, g) { return this._bin(true, i, z, f, g) },
  binCountUse: ['_bin'],

  sumCumu(i, f) {
    let s = 0,
        r = [],
        j = 0;
    for (let v of i) {
      r.push(s += +(f === void 0 ? v : f(v, j++, i)));
    }
    return r;
  },

  sum(i, f) { return this._sum(false, i, f) },
  sumUse: ['_sum'],

  mean(i, f) { return this._sum(true, i, f) },
  meanUse: ['_sum'],

  minIndex(i, f) { return this._minMaxIndex(false, i, f) },
  minIndexUse: ['_minMaxIndex'],

  maxIndex(i, f) { return this._minMaxIndex(true, i, f) },
  maxIndexUse: ['_minMaxIndex'],

  min(i, f) { return this._minMax(false, i, f) },
  minUse: ['_minMax'],

  max(i, f) { return this._minMax(true, i, f) },
  maxUse: ['_minMax'],

  variance(i, f) { return this._varDev(false, i, f) },
  varianceUse: ['_varDev'],

  deviation(i, f) { return this._varDev(true, i, f) },
  deviationUse: ['_varDev'],

  orderIndex(i, f = (x, y) => x - y) {
    i = [...i];
    return i.map((_, j) => j).sort((x, y) => f(i[x], i[y]));
  },

  order(i, f = (x, y) => x - y) {
    return [...i].sort(f);
  },

  some(i, f) {
    let j = 0;
    for (let v of i) {
      if (f(v, j++, i)) return true;
    }
    return false;
  },

  every(i, f) { 
    let j = 0;
    for (let v of i) {
      if (!f(v, j++, i)) return false;
    }
    return true;
  },

  filter(i, f) {
    let r = [],
        j = 0;
    for (let v of i) {
      if (f(v, j++, i)) r.push(v);
    }
    return r;
  },

  count(i, f) {
    let c = 0,
        j = 0;
    for (let v of i) {
      if (f(v, j++, i)) c++;
    }
    return c;
  },

  findIndex(i, f) {
    let j = 0;
    for (let v of i) {
      if (f(v, j, i)) return j;
      j++;
    }
    return -1;
  },

  find(i, f) {
    let j = 0;
    for (let v of i) {
      if (f(v, j++, i)) return v;
    }
  },

  arrObj(o, c) {
    let r = [];
    for (let k of c || Object.keys(o)) {
      let j = 0;
      for (let v of o[k]) {
        (r[j] || (r[j] = {}))[k] = v;
        j++;
      }
    }
    return r;
  },
  
  objArr(a, c) {
    let r = {},
        j = 0;
    for (let o of a) {
      for (let k of c || Object.keys(o)) {
        (r[k] || (r[k] = []))[j] = o[k];
      }
      j++;
    }
    return r;
  },

  transpose(x) {
    let r = [],
        j = 0;
    for (let y of x) {
      let k = 0;
      for (let v of y) {
        (r[k] || (r[k] = []))[j] = v;
        k++;
      }
      j++;
    }
    return r;
  },

  pickDoc(s) {
    return [...document.querySelectorAll(s)];
  },

  random(j = 0, k = 1, n) {
    return this._sample(this._random, n, +j, +k);
  },
  randomUse: ['_sample', '_random'],

  randomInt(j = 0, k = 2, n) {
    return this._sample(this._randomInt, n, +j, +k);
  },
  randomIntUse: ['_sample', '_randomInt'],

  categorical(m, n) {
    let q = [],
        c = 0;
    for (let w of m) {
      q.push(c += +w);
    }
    return this._sample(this._categorical, n, q, c);
  },
  categoricalUse: ['_sample', '_categorical'],
  
  normal(m = 0, d = 1, n) {
    return this._sample(this._normal(+m, +d), n);
  },
  normalUse: ['_sample', '_normal'],

  logNormal(m = 0, d = 1, n) {
    return this._sample(this._normal(+m, +d, true), n);
  },
  logNormalUse: ['_sample', '_normal'],

  binomial(m, p = 0.5, n) {
    return this._sample(this._binomial, n, +m, +p);
  },
  binomialUse: ['_sample', '_binomial'],

  exponential(r, n) {
    return this._sample(this._exponential, n, +r);
  },
  exponentialUse: ['_sample', '_exponential'],

  geometric(p = 0.5, n) {
    return this._sample(this._geometric, n, +p);
  },
  geometricUse: ['_sample', '_geometric'],

  shuffle(x) {  // Fisher–Yates
    x = [...x];
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (i !== j) {
        const t = x[i];
        x[i] = x[j];
        x[j] = t;
      } 
    }
    return x;
  },

  period(m) {
    return new Promise(r => setTimeout(r, m));
  },

  at(o, p) {
    let r;
    if (typeof o === 'string') {
      r = '';
      for (let k of p) r += o[k]; 
    }
    else if (Array.isArray(o)) {
      r = [];
      for (let k of p) r.push(o[k]); 
    }
    else {
      r = {};
      for (let k of p) r[k] = o[k]; 
    }
    return r;
  },

  pickIn(p, s) {
    return [...this._first(p).querySelectorAll(s)];
  },
  pickInUse: ['_first'],

  insert(t, e, p = () => null) {
    t = this._first(t);
    if (typeof e === 'function') e = e.call(t, t.__data__);
    else e = this._autoSelect(e);
    p = this._first(p.call(t, t.__data__));
    for (let w of (e && e[Symbol.iterator] ? e : [e])) {
      t.insertBefore(w, p);
    }
    return e;
  },
  insertUse: ['_first', '_autoSelect'],

  insertEach(t, f, p = () => null) {
    let r = [],
        j = 0;
    if (typeof t === 'string') t = document.querySelectorAll(t);
    else if (!(t && t[Symbol.iterator])) t = [t];
    for (let q of t) {
      let v = f.call(q, q.__data__, j);
      let m = this._first(p.call(q, q.__data__, j++));
      r.push(v);
      for (let w of (v && v[Symbol.iterator] ? v : [v])) {
        q.insertBefore(w, m);
      }
    }
    return r;
  },
  insertEachUse: ['_first'],
  
  into(e, t, p = () => null) {
    t = this._first(t);
    if (typeof e === 'function') e = e.call(t, t.__data__);
    else if (typeof e === 'string') e = document.querySelectorAll(e);
    p = this._first(p.call(t, t.__data__));
    for (let q of (e && e[Symbol.iterator] ? e : [e])) {
      t.insertBefore(q, p);
    }
    return t;
  },
  intoUse: ['_first'],
   
  encode(x, t, a) { return this._encode(false, x, t, a) },
  encodeUse: ['_encode'],

  encodeSVG(x, t, a) { return this._encode(true, x, t, a) },
  encodeSVGUse: ['_encode'],

  create(t, n) { return this._create(false, t, n) },
  createUse: createArray,

  createSVG(t, n) { return this._create(true, t, n) },
  createSVGUse: createArray,

  attr(...x) {
    return (x.length === 2)
      ? this._apsGet(this._getAttr, ...x)
      : this._apsSet(this._setAttr, ...x);
  },
  attrUse: ['_apsGet', '_apsSet', '_getAttr', '_setAttr', '_autoSelect'],

  prop(...x) {
    return (x.length === 2)
      ? this._apsGet(this._getProp, ...x)
      : this._apsSet(this._setProp, ...x);
  },
  propUse: ['_apsGet', '_apsSet', '_getProp', '_setProp', '_autoSelect'],

  style(...x) {
    return (x.length === 2)
      ? this._apsGet(this._getStyle, ...x)
      : this._apsSet(this._setStyle, ...x);
  },
  styleUse: ['_apsGet', '_apsSet', '_getStyle', '_setStyle', '_autoSelect'],

  text(...x) {
    return (x.length === 1)
      ? this._apsGet(this._getProp, x[0], 'textContent')
      : this._apsSet(this._setProp, x[0], 'textContent', x[1]);
  },
  textUse: ['_apsGet', '_apsSet', '_getProp', '_setProp', '_autoSelect'],

  html(...x) {
    return (x.length === 1)
      ? this._apsGet(this._getProp, x[0], 'innerHTML')
      : this._apsSet(this._setProp, x[0], 'innerHTML', x[1]);
  },
  htmlUse: ['_apsGet', '_apsSet', '_getProp', '_setProp', '_autoSelect'],

  remove(e) {
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        q.parentNode.removeChild(q);
      }
    }
    else {
      e.parentNode.removeChild(e);
    }
    return e;
  },
  removeUse: ['_autoSelect'],

  lower(e) {
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        let p = q.parentNode;
        p.insertBefore(q, p.firstChild);
      }
    }
    else {
      let p = e.parentNode;
      p.insertBefore(e, p.firstChild);
    }
    return e;
  },
  lowerUse: ['_autoSelect'],

  raise(e) {
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        q.parentNode.insertBefore(q, null);
      }
    }
    else {
      e.parentNode.insertBefore(e, null);
    }
    return e;
  },
  raiseUse: ['_autoSelect'],

  addClass(e, c) {
    c = c.trim().split(/^|\s+/);
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        q.classList.add(...c);
      }
    }
    else {
      e.classList.add(...c);
    }
    return e;
  },
  addClassUse: ['_autoSelect'],

  removeClass(e, c) {
    c = c.trim().split(/^|\s+/);
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        q.classList.remove(...c);
      }
    }
    else {
      e.classList.remove(...c);
    }
    return e;
  },
  removeClassUse: ['_autoSelect'],

  removeAttr(e, a) {
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        q.removeAttribute(a);
      }
    }
    else {
      e.removeAttribute(a);
    }
    return e;
  },
  removeAttrUse: ['_autoSelect'],

  removeStyle(e, s) {
    e = this._autoSelect(e);
    if (e && e[Symbol.iterator]) {
      for (let q of e) {
        q.style.removeProperty(s);
      }
    }
    else {
      e.style.removeProperty(s);
    }
    return e;
  },
  removeStyleUse: ['_autoSelect'],

  hasClass(e, c) {
    let r;
    if (typeof e === 'string') e = document.querySelectorAll(e);
    if (e && e[Symbol.iterator]) {
      r = [];
      for (let q of e) {
        r.push(q.classList.contains(c));
      }
    }
    else {
      r = e.classList.contains(c);
    }
    return r;
  },

  hasAttr(e, a) {
    let r;
    if (typeof e === 'string') e = document.querySelectorAll(e);
    if (e && e[Symbol.iterator]) {
      r = [];
      for (let q of e) {
        r.push(q.hasAttribute(a));
      }
    }
    else {
      r = e.hasAttribute(a);
    }
    return r;
  },

  on(e, t, f, c = false) {
    e = this._autoSelect(e);
    for (let q of (e && e[Symbol.iterator] ? e : [e])) {
      let g = k => f.call(q, q.__data__, k);
      if (!q.__on__) q.__on__ = {};
      for (let w of t.trim().split(/^|\s+/)) {
        if (!q.__on__[w]) q.__on__[w] = new Map();
        else if (q.__on__[w].has(f)) continue;
        q.addEventListener(w, g, c);
        q.__on__[w].set(f, g);
      }
    }
    return e;
  },
  onUse: ['_autoSelect'],

  off(e, t, f, c = false) {
    e = this._autoSelect(e);
    for (let q of (e && e[Symbol.iterator] ? e : [e])) {
      if (!q.__on__) continue;
      for (let w of t.trim().split(/^|\s+/)) {
        let g = q.__on__[w] ? q.__on__[w].get(f) : undefined;
        if (g) {
          q.removeEventListener(w, g, c);
          q.__on__[w].delete(f);
        }
      }
    }
    return e;
  },
  offUse: ['_autoSelect'],

  sketch({
      width: w = 300,
      height: h = 300,
      context: d = "2d",
      scale: s = true,
      ...o} = {}) {
    let r = window.devicePixelRatio;
    let c = document.createElement("canvas");
    let x = c.getContext(d, o);
    if (s && d === "2d") {
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = w * r;
      c.height = h * r;
      x.scale(r, r);
    }
    else {
      c.width = w;
      c.height = h;
    }
    return [c, x];
  },

  // HTML convenience
  $a(n) {return this._create(false, 'a', n)}, $aUse: createArray,
  $abbr(n) {return this._create(false, 'abbr', n)}, $abbrUse: createArray,
  $address(n) {return this._create(false, 'address', n)}, $addressUse: createArray,
  $area(n) {return this._create(false, 'area', n)}, $areaUse: createArray,
  $article(n) {return this._create(false, 'article', n)}, $articleUse: createArray,
  $aside(n) {return this._create(false, 'aside', n)}, $asideUse: createArray,
  $audio(n) {return this._create(false, 'audio', n)}, $audioUse: createArray,
  $b(n) {return this._create(false, 'b', n)}, $bUse: createArray,
  $bdi(n) {return this._create(false, 'bdi', n)}, $bdiUse: createArray,
  $bdo(n) {return this._create(false, 'bdo', n)}, $bdoUse: createArray,
  $blockquote(n) {return this._create(false, 'blockquote', n)}, $blockquoteUse: createArray,
  $br(n) {return this._create(false, 'br', n)}, $brUse: createArray,
  $button(n) {return this._create(false, 'button', n)}, $buttonUse: createArray,
  $canvas(n) {return this._create(false, 'canvas', n)}, $canvasUse: createArray,
  $caption(n) {return this._create(false, 'caption', n)}, $captionUse: createArray,
  $cite(n) {return this._create(false, 'cite', n)}, $citeUse: createArray,
  $code(n) {return this._create(false, 'code', n)}, $codeUse: createArray,
  $col(n) {return this._create(false, 'col', n)}, $colUse: createArray,
  $colgroup(n) {return this._create(false, 'colgroup', n)}, $colgroupUse: createArray,
  $datalist(n) {return this._create(false, 'datalist', n)}, $datalistUse: createArray,
  $dd(n) {return this._create(false, 'dd', n)}, $ddUse: createArray,
  $del(n) {return this._create(false, 'del', n)}, $delUse: createArray,
  $details(n) {return this._create(false, 'details', n)}, $detailsUse: createArray,
  $dfn(n) {return this._create(false, 'dfn', n)}, $dfnUse: createArray,
  $dialog(n) {return this._create(false, 'dialog', n)}, $dialogUse: createArray,
  $div(n) {return this._create(false, 'div', n)}, $divUse: createArray,
  $dl(n) {return this._create(false, 'dl', n)}, $dlUse: createArray,
  $dt(n) {return this._create(false, 'dt', n)}, $dtUse: createArray,
  $em(n) {return this._create(false, 'em', n)}, $emUse: createArray,
  $embed(n) {return this._create(false, 'embed', n)}, $embedUse: createArray,
  $fieldset(n) {return this._create(false, 'fieldset', n)}, $fieldsetUse: createArray,
  $figcaption(n) {return this._create(false, 'figcaption', n)}, $figcaptionUse: createArray,
  $figure(n) {return this._create(false, 'figure', n)}, $figureUse: createArray,
  $footer(n) {return this._create(false, 'footer', n)}, $footerUse: createArray,
  $form(n) {return this._create(false, 'form', n)}, $formUse: createArray,
  $h1(n) {return this._create(false, 'h1', n)}, $h1Use: createArray,
  $h2(n) {return this._create(false, 'h2', n)}, $h2Use: createArray,
  $h3(n) {return this._create(false, 'h3', n)}, $h3Use: createArray,
  $h4(n) {return this._create(false, 'h4', n)}, $h4Use: createArray,
  $h5(n) {return this._create(false, 'h5', n)}, $h5Use: createArray,
  $h6(n) {return this._create(false, 'h6', n)}, $h6Use: createArray,
  $header(n) {return this._create(false, 'header', n)}, $headerUse: createArray,
  $hgroup(n) {return this._create(false, 'hgroup', n)}, $hgroupUse: createArray,
  $hr(n) {return this._create(false, 'hr', n)}, $hrUse: createArray,
  $i(n) {return this._create(false, 'i', n)}, $iUse: createArray,
  $iframe(n) {return this._create(false, 'iframe', n)}, $iframeUse: createArray,
  $img(n) {return this._create(false, 'img', n)}, $imgUse: createArray,
  $input(n) {return this._create(false, 'input', n)}, $inputUse: createArray,
  $ins(n) {return this._create(false, 'ins', n)}, $insUse: createArray,
  $kbd(n) {return this._create(false, 'kbd', n)}, $kbdUse: createArray,
  $label(n) {return this._create(false, 'label', n)}, $labelUse: createArray,
  $legend(n) {return this._create(false, 'legend', n)}, $legendUse: createArray,
  $li(n) {return this._create(false, 'li', n)}, $liUse: createArray,
  $link(n) {return this._create(false, 'link', n)}, $linkUse: createArray,
  $main(n) {return this._create(false, 'main', n)}, $mainUse: createArray,
  $mark(n) {return this._create(false, 'mark', n)}, $markUse: createArray,
  $menu(n) {return this._create(false, 'menu', n)}, $menuUse: createArray,
  $meta(n) {return this._create(false, 'meta', n)}, $metaUse: createArray,
  $meter(n) {return this._create(false, 'meter', n)}, $meterUse: createArray,
  $nav(n) {return this._create(false, 'nav', n)}, $navUse: createArray,
  $noscript(n) {return this._create(false, 'noscript', n)}, $noscriptUse: createArray,
  $ol(n) {return this._create(false, 'ol', n)}, $olUse: createArray,
  $optgroup(n) {return this._create(false, 'optgroup', n)}, $optgroupUse: createArray,
  $option(n) {return this._create(false, 'option', n)}, $optionUse: createArray,
  $output(n) {return this._create(false, 'output', n)}, $outputUse: createArray,
  $p(n) {return this._create(false, 'p', n)}, $pUse: createArray,
  $picture(n) {return this._create(false, 'picture', n)}, $pictureUse: createArray,
  $pre(n) {return this._create(false, 'pre', n)}, $preUse: createArray,
  $progress(n) {return this._create(false, 'progress', n)}, $progressUse: createArray,
  $q(n) {return this._create(false, 'q', n)}, $qUse: createArray,
  $rb(n) {return this._create(false, 'rb', n)}, $rbUse: createArray,
  $rp(n) {return this._create(false, 'rp', n)}, $rpUse: createArray,
  $rt(n) {return this._create(false, 'rt', n)}, $rtUse: createArray,
  $rtc(n) {return this._create(false, 'rtc', n)}, $rtcUse: createArray,
  $ruby(n) {return this._create(false, 'ruby', n)}, $rubyUse: createArray,
  $s(n) {return this._create(false, 's', n)}, $sUse: createArray,
  $samp(n) {return this._create(false, 'samp', n)}, $sampUse: createArray,
  $script(n) {return this._create(false, 'script', n)}, $scriptUse: createArray,
  $section(n) {return this._create(false, 'section', n)}, $sectionUse: createArray,
  $select(n) {return this._create(false, 'select', n)}, $selectUse: createArray,
  $slot(n) {return this._create(false, 'slot', n)}, $slotUse: createArray,
  $small(n) {return this._create(false, 'small', n)}, $smallUse: createArray,
  $source(n) {return this._create(false, 'source', n)}, $sourceUse: createArray,
  $span(n) {return this._create(false, 'span', n)}, $spanUse: createArray,
  $strong(n) {return this._create(false, 'strong', n)}, $strongUse: createArray,
  $sub(n) {return this._create(false, 'sub', n)}, $subUse: createArray,
  $summary(n) {return this._create(false, 'summary', n)}, $summaryUse: createArray,
  $sup(n) {return this._create(false, 'sup', n)}, $supUse: createArray,
  $table(n) {return this._create(false, 'table', n)}, $tableUse: createArray,
  $tbody(n) {return this._create(false, 'tbody', n)}, $tbodyUse: createArray,
  $td(n) {return this._create(false, 'td', n)}, $tdUse: createArray,
  $template(n) {return this._create(false, 'template', n)}, $templateUse: createArray,
  $textarea(n) {return this._create(false, 'textarea', n)}, $textareaUse: createArray,
  $tfoot(n) {return this._create(false, 'tfoot', n)}, $tfootUse: createArray,
  $th(n) {return this._create(false, 'th', n)}, $thUse: createArray,
  $thead(n) {return this._create(false, 'thead', n)}, $theadUse: createArray,
  $time(n) {return this._create(false, 'time', n)}, $timeUse: createArray,
  $title(n) {return this._create(false, 'title', n)}, $titleUse: createArray,
  $tr(n) {return this._create(false, 'tr', n)}, $trUse: createArray,
  $track(n) {return this._create(false, 'track', n)}, $trackUse: createArray,
  $u(n) {return this._create(false, 'u', n)}, $uUse: createArray,
  $ul(n) {return this._create(false, 'ul', n)}, $ulUse: createArray,
  $var(n) {return this._create(false, 'var', n)}, $varUse: createArray,
  $video(n) {return this._create(false, 'video', n)}, $videoUse: createArray,
  $wbr(n) {return this._create(false, 'wbr', n)}, $wbrUse: createArray,

  // SVG convenience
  $animate(n) {return this._create(true, 'animate', n)}, $animateUse: createArray,
  $animateMotion(n) {return this._create(true, 'animateMotion', n)}, $animateMotionUse: createArray,
  $animateTransform(n) {return this._create(true, 'animateTransform', n)}, $animateTransformUse: createArray,
  $circle(n) {return this._create(true, 'circle', n)}, $circleUse: createArray,
  $clipPath(n) {return this._create(true, 'clipPath', n)}, $clipPathUse: createArray,
  $defs(n) {return this._create(true, 'defs', n)}, $defsUse: createArray,
  $desc(n) {return this._create(true, 'desc', n)}, $descUse: createArray,
  $discard(n) {return this._create(true, 'discard', n)}, $discardUse: createArray,
  $ellipse(n) {return this._create(true, 'ellipse', n)}, $ellipseUse: createArray,
  $feBlend(n) {return this._create(true, 'feBlend', n)}, $feBlendUse: createArray,
  $feColorMatrix(n) {return this._create(true, 'feColorMatrix', n)}, $feColorMatrixUse: createArray,
  $feComponentTransfer(n) {return this._create(true, 'feComponentTransfer', n)}, $feComponentTransferUse: createArray,
  $feComposite(n) {return this._create(true, 'feComposite', n)}, $feCompositeUse: createArray,
  $feConvolveMatrix(n) {return this._create(true, 'feConvolveMatrix', n)}, $feConvolveMatrixUse: createArray,
  $feDiffuseLighting(n) {return this._create(true, 'feDiffuseLighting', n)}, $feDiffuseLightingUse: createArray,
  $feDisplacementMap(n) {return this._create(true, 'feDisplacementMap', n)}, $feDisplacementMapUse: createArray,
  $feDistantLight(n) {return this._create(true, 'feDistantLight', n)}, $feDistantLightUse: createArray,
  $feDropShadow(n) {return this._create(true, 'feDropShadow', n)}, $feDropShadowUse: createArray,
  $feFlood(n) {return this._create(true, 'feFlood', n)}, $feFloodUse: createArray,
  $feFuncA(n) {return this._create(true, 'feFuncA', n)}, $feFuncAUse: createArray,
  $feFuncB(n) {return this._create(true, 'feFuncB', n)}, $feFuncBUse: createArray,
  $feFuncG(n) {return this._create(true, 'feFuncG', n)}, $feFuncGUse: createArray,
  $feFuncR(n) {return this._create(true, 'feFuncR', n)}, $feFuncRUse: createArray,
  $feGaussianBlur(n) {return this._create(true, 'feGaussianBlur', n)}, $feGaussianBlurUse: createArray,
  $feImage(n) {return this._create(true, 'feImage', n)}, $feImageUse: createArray,
  $feMerge(n) {return this._create(true, 'feMerge', n)}, $feMergeUse: createArray,
  $feMergeNode(n) {return this._create(true, 'feMergeNode', n)}, $feMergeNodeUse: createArray,
  $feMorphology(n) {return this._create(true, 'feMorphology', n)}, $feMorphologyUse: createArray,
  $feOffset(n) {return this._create(true, 'feOffset', n)}, $feOffsetUse: createArray,
  $fePointLight(n) {return this._create(true, 'fePointLight', n)}, $fePointLightUse: createArray,
  $feSpecularLighting(n) {return this._create(true, 'feSpecularLighting', n)}, $feSpecularLightingUse: createArray,
  $feSpotLight(n) {return this._create(true, 'feSpotLight', n)}, $feSpotLightUse: createArray,
  $feTile(n) {return this._create(true, 'feTile', n)}, $feTileUse: createArray,
  $feTurbulence(n) {return this._create(true, 'feTurbulence', n)}, $feTurbulenceUse: createArray,
  $foreignObject(n) {return this._create(true, 'foreignObject', n)}, $foreignObjectUse: createArray,
  $g(n) {return this._create(true, 'g', n)}, $gUse: createArray,
  $hatch(n) {return this._create(true, 'hatch', n)}, $hatchUse: createArray,
  $hatchpath(n) {return this._create(true, 'hatchpath', n)}, $hatchpathUse: createArray,
  $image(n) {return this._create(true, 'image', n)}, $imageUse: createArray,
  $line(n) {return this._create(true, 'line', n)}, $lineUse: createArray,
  $linearGradient(n) {return this._create(true, 'linearGradient', n)}, $linearGradientUse: createArray,
  $marker(n) {return this._create(true, 'marker', n)}, $markerUse: createArray,
  $mask(n) {return this._create(true, 'mask', n)}, $maskUse: createArray,
  $metadata(n) {return this._create(true, 'metadata', n)}, $metadataUse: createArray,
  $mpath(n) {return this._create(true, 'mpath', n)}, $mpathUse: createArray,
  $path(n) {return this._create(true, 'path', n)}, $pathUse: createArray,
  $pattern(n) {return this._create(true, 'pattern', n)}, $patternUse: createArray,
  $polygon(n) {return this._create(true, 'polygon', n)}, $polygonUse: createArray,
  $polyline(n) {return this._create(true, 'polyline', n)}, $polylineUse: createArray,
  $radialGradient(n) {return this._create(true, 'radialGradient', n)}, $radialGradientUse: createArray,
  $rect(n) {return this._create(true, 'rect', n)}, $rectUse: createArray, 
  $solidcolor(n) {return this._create(true, 'solidcolor', n)}, $solidcolorUse: createArray,
  $stop(n) {return this._create(true, 'stop', n)}, $stopUse: createArray,
  $svg(n) {return this._create(true, 'svg', n)}, $svgUse: createArray,
  $symbol(n) {return this._create(true, 'symbol', n)}, $symbolUse: createArray,
  $textPath(n) {return this._create(true, 'textPath', n)}, $textPathUse: createArray,
  $tspan(n) {return this._create(true, 'tspan', n)}, $tspanUse: createArray,
  $use(n) {return this._create(true, 'use', n)}, $useUse: createArray,
  $view(n) {return this._create(true, 'view', n)}, $viewUse: createArray,

  // entrywise
  abs(x) {return this._ew(x, Math.abs)}, absUse: ['_ew'],
  acos(x) {return this._ew(x, Math.acos)}, acosUse: ['_ew'],
  acosh(x) {return this._ew(x, Math.acosh)}, acoshUse: ['_ew'],
  asin(x) {return this._ew(x, Math.asin)}, asinUse: ['_ew'],
  asinh(x) {return this._ew(x, Math.asinh)}, asinhUse: ['_ew'],
  atan(x) {return this._ew(x, Math.atan)}, atanUse: ['_ew'],
  atanh(x) {return this._ew(x, Math.atanh)}, atanhUse: ['_ew'],
  cbrt(x) {return this._ew(x, Math.cbrt)}, cbrtUse: ['_ew'],
  ceil(x) {return this._ew(x, Math.ceil)}, ceilUse: ['_ew'],
  clz32(x) {return this._ew(x, Math.clz32)}, clz32Use: ['_ew'],
  cos(x) {return this._ew(x, Math.cos)}, cosUse: ['_ew'],
  cosh(x) {return this._ew(x, Math.cosh)}, coshUse: ['_ew'],
  exp(x) {return this._ew(x, Math.exp)}, expUse: ['_ew'],
  expm1(x) {return this._ew(x, Math.expm1)}, expm1Use: ['_ew'],
  floor(x) {return this._ew(x, Math.floor)}, floorUse: ['_ew'],
  fround(x) {return this._ew(x, Math.fround)}, froundUse: ['_ew'],
  log(x) {return this._ew(x, Math.log)}, logUse: ['_ew'],
  log10(x) {return this._ew(x, Math.log10)}, log10Use: ['_ew'],
  log1p(x) {return this._ew(x, Math.log1p)}, log1pUse: ['_ew'],
  log2(x) {return this._ew(x, Math.log2)}, log2Use: ['_ew'],
  round(x) {return this._ew(x, Math.round)}, roundUse: ['_ew'],
  sign(x) {return this._ew(x, Math.sign)}, signUse: ['_ew'],
  sin(x) {return this._ew(x, Math.sin)}, sinUse: ['_ew'],
  sinh(x) {return this._ew(x, Math.sinh)}, sinhUse: ['_ew'],
  sqrt(x) {return this._ew(x, Math.sqrt)}, sqrtUse: ['_ew'],
  tan(x) {return this._ew(x, Math.tan)}, tanUse: ['_ew'],
  tanh(x) {return this._ew(x, Math.tanh)}, tanhUse: ['_ew'],
  trunc(x) {return this._ew(x, Math.trunc)}, truncUse: ['_ew'],
  toUpperCase(x) {return this._ew(x, y => String.prototype.toUpperCase.call(y))}, toUpperCaseUse: ['_ew'],
  toLowerCase(x) {return this._ew(x, y => String.prototype.toLowerCase.call(y))}, toLowerCaseUse: ['_ew'],
  trim(x) {return this._ew(x, y => String.prototype.trim.call(y))}, trimUse: ['_ew'],
  trimEnd(x) {return this._ew(x, y => String.prototype.trimEnd.call(y))}, trimEndUse: ['_ew'],
  trimStart(x) {return this._ew(x, y => String.prototype.trimStart.call(y))}, trimStartUse: ['_ew'],
  neg(x) {return this._ew(x, y => -y)}, negUse: ['_ew'],
  boolean(x) {return this._ew(x, Boolean)}, booleanUse: ['_ew'],
  number(x) {return this._ew(x, Number)}, numberUse: ['_ew'],
  string(x) {return this._ew(x, String)}, stringUse: ['_ew'],
  date(x) {return this._ew(x, y => new Date(y))}, dateUse: ['_ew'],
  isInteger(x) {return this._ew(x, Number.isInteger)}, isIntegerUse: ['_ew'],
  isFinite(x) {return this._ew(x, Number.isFinite)}, isFiniteUse: ['_ew'],
  isNaN(x) {return this._ew(x, Number.isNaN)}, isNaNUse: ['_ew'],
  not(x) {return this._ew(x, y => !y)}, notUse: ['_ew']

};