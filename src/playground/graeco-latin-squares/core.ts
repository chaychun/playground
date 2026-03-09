// Finite field arithmetic

export function primePowerDecomposition(n: number): { p: number; k: number } | null {
  if (n < 2) return null;
  let p = 0;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      p = d;
      break;
    }
  }
  if (p === 0) return { p: n, k: 1 };
  let k = 0;
  let m = n;
  while (m % p === 0) {
    m = Math.floor(m / p);
    k++;
  }
  if (m !== 1) return null;
  return { p, k };
}

function toVector(x: number, p: number, k: number): number[] {
  const v: number[] = Array.from({ length: k }, () => 0);
  let m = x;
  for (let i = 0; i < k; i++) {
    v[i] = m % p;
    m = Math.floor(m / p);
  }
  return v;
}

function fromVector(v: number[], p: number): number {
  let x = 0;
  let mult = 1;
  for (let i = 0; i < v.length; i++) {
    x += v[i] * mult;
    mult *= p;
  }
  return x;
}

function trimZeros(a: number[]): number[] {
  let end = a.length - 1;
  while (end > 0 && a[end] === 0) end--;
  return a.slice(0, end + 1);
}

function polyAdd(a: number[], b: number[], p: number): number[] {
  const n = Math.max(a.length, b.length);
  const out = Array.from({ length: n }, () => 0);
  for (let i = 0; i < n; i++) {
    const ai = i < a.length ? a[i] : 0;
    const bi = i < b.length ? b[i] : 0;
    out[i] = (ai + bi) % p;
  }
  return trimZeros(out);
}

function polySub(a: number[], b: number[], p: number): number[] {
  const n = Math.max(a.length, b.length);
  const out = Array.from({ length: n }, () => 0);
  for (let i = 0; i < n; i++) {
    const ai = i < a.length ? a[i] : 0;
    const bi = i < b.length ? b[i] : 0;
    out[i] = (ai - bi) % p;
    if (out[i] < 0) out[i] += p;
  }
  return trimZeros(out);
}

function polyMul(a: number[], b: number[], p: number): number[] {
  const out = Array.from({ length: a.length + b.length - 1 }, () => 0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      out[i + j] = (out[i + j] + a[i] * b[j]) % p;
    }
  }
  return trimZeros(out);
}

function polyMod(a: number[], modPoly: number[], p: number): number[] {
  let r = a.slice();
  const k = modPoly.length - 1;
  for (;;) {
    r = trimZeros(r);
    if (r.length - 1 < k) break;
    const diff = r.length - 1 - k;
    const coeff = r[r.length - 1];
    if (coeff !== 0) {
      for (let i = 0; i <= k; i++) {
        const idx = i + diff;
        const sub = (coeff * modPoly[i]) % p;
        r[idx] = (r[idx] - sub) % p;
        if (r[idx] < 0) r[idx] += p;
      }
    } else {
      r.pop();
    }
  }
  return trimZeros(r);
}

function getIrreduciblePoly(p: number, k: number): number[] | null {
  if (k <= 1) return [1];
  if (p === 2 && k === 2) return [1, 1, 1];
  if (p === 2 && k === 3) return [1, 1, 0, 1];
  if (p === 3 && k === 2) return [1, 0, 1];
  return null;
}

function gfMul(a: number[], b: number[], p: number, modPoly: number[]): number[] {
  if (modPoly.length === 1) {
    return [((a[0] || 0) * (b[0] || 0)) % p];
  }
  return polyMod(polyMul(a, b, p), modPoly, p);
}

function gfIsZero(a: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== 0) return false;
  return true;
}

// Graeco-Latin square generation

export interface GraecoLatinSquare {
  latin: number[][];
  greek: number[][];
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function areMultipliersValid(a: number, b: number, n: number): boolean {
  if (a === b) return false;
  if (gcd(a, n) !== 1) return false;
  if (gcd(b, n) !== 1) return false;
  return gcd(Math.abs(b - a), n) === 1;
}

function generateCyclicGraecoLatin(
  n: number,
  latinMultiplier = 1,
  greekMultiplier = 2,
): GraecoLatinSquare {
  const latin: number[][] = [];
  const greek: number[][] = [];
  for (let i = 0; i < n; i++) {
    latin[i] = [];
    greek[i] = [];
    for (let j = 0; j < n; j++) {
      latin[i][j] = (i + latinMultiplier * j) % n;
      greek[i][j] = (i + greekMultiplier * j) % n;
    }
  }
  return { latin, greek };
}

function generateFiniteFieldGraecoLatin(
  n: number,
  matrix?: [[number, number], [number, number]],
): GraecoLatinSquare | null {
  const dec = primePowerDecomposition(n);
  if (!dec) return null;
  const { p, k } = dec;
  const modPoly = getIrreduciblePoly(p, k);
  if (!modPoly) return null;

  if (k === 1) {
    const toInt = (x: number) => {
      let m = x % p;
      if (m < 0) m += p;
      return m;
    };
    const defaults = { a: 1, b: 1, c: 1, d: toInt(2) };
    const a = matrix ? toInt(matrix[0][0]) : defaults.a;
    const b = matrix ? toInt(matrix[0][1]) : defaults.b;
    const c = matrix ? toInt(matrix[1][0]) : defaults.c;
    const d = matrix ? toInt(matrix[1][1]) : defaults.d;
    let det = (a * d - b * c) % p;
    if (det < 0) det += p;
    if (det === 0) return null;
    const latin: number[][] = [];
    const greek: number[][] = [];
    for (let i = 0; i < n; i++) {
      latin[i] = [];
      greek[i] = [];
      for (let j = 0; j < n; j++) {
        latin[i][j] = (a * i + b * j) % p;
        greek[i][j] = (c * i + d * j) % p;
      }
    }
    return { latin, greek };
  }

  const one: number[] = Array.from({ length: k }, () => 0);
  one[0] = 1;
  const alpha: number[] = (() => {
    const v = Array.from({ length: k }, () => 0);
    v[1] = 1;
    return v;
  })();
  const toElt = (x: number) => toVector(((x % n) + n) % n, p, k);
  const a = matrix ? toElt(matrix[0][0]) : one;
  const b = matrix ? toElt(matrix[0][1]) : one;
  const c = matrix ? toElt(matrix[1][0]) : one;
  const d = matrix ? toElt(matrix[1][1]) : alpha;
  const det = polySub(gfMul(a, d, p, modPoly), gfMul(b, c, p, modPoly), p);
  if (gfIsZero(det)) return null;
  const latin: number[][] = [];
  const greek: number[][] = [];
  for (let i = 0; i < n; i++) {
    latin[i] = [];
    greek[i] = [];
    const vi = toVector(i, p, k);
    for (let j = 0; j < n; j++) {
      const vj = toVector(j, p, k);
      const l = polyAdd(gfMul(a, vi, p, modPoly), gfMul(b, vj, p, modPoly), p);
      const g = polyAdd(gfMul(c, vi, p, modPoly), gfMul(d, vj, p, modPoly), p);
      latin[i][j] = fromVector(l, p);
      greek[i][j] = fromVector(g, p);
    }
  }
  return { latin, greek };
}

function directProductGraecoLatin(A: GraecoLatinSquare, B: GraecoLatinSquare): GraecoLatinSquare {
  const m = A.latin.length;
  const n = B.latin.length;
  const size = m * n;
  const latin: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  const greek: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      const aL = A.latin[i][j];
      const aG = A.greek[i][j];
      for (let i2 = 0; i2 < n; i2++) {
        for (let j2 = 0; j2 < n; j2++) {
          const r = i * n + i2;
          const c = j * n + j2;
          latin[r][c] = aL * n + B.latin[i2][j2];
          greek[r][c] = aG * n + B.greek[i2][j2];
        }
      }
    }
  }
  return { latin, greek };
}

function isMethodOfDifferenceSupported(n: number): boolean {
  const m = (n - 1) / 3;
  return Number.isInteger(m) && m % 2 === 1 && m >= 1;
}

function generateMethodOfDifferenceGraecoLatin(m: number): GraecoLatinSquare {
  const n = 2 * m + 1;
  const v = 3 * m + 1;

  const x = (j: number) => n + j;

  const A0: number[][] = [[], [], [], []];
  for (let j = 0; j < m; j++) {
    const r = j + 1;
    const s = 2 * m - j;
    const X = x(j);
    A0[0].push(0);
    A0[1].push(r);
    A0[2].push(s);
    A0[3].push(X);

    A0[0].push(r);
    A0[1].push(0);
    A0[2].push(X);
    A0[3].push(s);

    A0[0].push(s);
    A0[1].push(X);
    A0[2].push(0);
    A0[3].push(r);

    A0[0].push(X);
    A0[1].push(s);
    A0[2].push(r);
    A0[3].push(0);
  }

  const addShift = (arr: number[][], shift: number) => {
    const out: number[][] = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      for (let c = 0; c < arr[i].length; c++) {
        const v0 = arr[i][c];
        out[i].push(v0 < n ? (v0 + shift) % n : v0);
      }
    }
    return out;
  };

  const rows: number[][] = [[], [], [], []];
  for (let i = 0; i < n; i++) {
    rows[0].push(i);
    rows[1].push(i);
    rows[2].push(i);
    rows[3].push(i);
  }
  for (let s = 0; s < n; s++) {
    const As = addShift(A0, s);
    for (let i = 0; i < 4; i++) rows[i].push(...As[i]);
  }

  const Astar: number[][] = [[], [], [], []];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < m; c++) {
      Astar[0].push(x(r));
      Astar[1].push(x(c));
      Astar[2].push(x((r + c) % m));
      Astar[3].push(x((2 * r + c) % m));
    }
  }
  for (let i = 0; i < 4; i++) rows[i].push(...Astar[i]);

  const latin: number[][] = Array.from({ length: v }, () => Array(v).fill(0));
  const greek: number[][] = Array.from({ length: v }, () => Array(v).fill(0));
  const cols = rows[0].length;
  for (let idx = 0; idx < cols; idx++) {
    const row = rows[0][idx];
    const col = rows[1][idx];
    latin[row][col] = rows[2][idx];
    greek[row][col] = rows[3][idx];
  }
  return { latin, greek };
}

// Randomized generation

type Method = "cyclic" | "finite" | "difference" | "direct";

function getValidMethods(size: number): Method[] {
  const methods: Method[] = [];
  if (size % 2 !== 0) methods.push("cyclic");
  if (primePowerDecomposition(size)) methods.push("finite");
  if (isMethodOfDifferenceSupported(size)) methods.push("difference");
  if (size === 12) methods.push("direct");
  return methods;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Random integer in [1, max-1] — ensures non-zero matrix entries */
function randomNonZero(max: number): number {
  return 1 + Math.floor(Math.random() * (max - 1));
}

export function generateRandom(size: number): GraecoLatinSquare {
  const methods = getValidMethods(size);
  const method = pickRandom(methods);

  switch (method) {
    case "cyclic": {
      const pairs: [number, number][] = [];
      for (let a = 1; a < size; a++) {
        for (let b = 1; b < size; b++) {
          if (areMultipliersValid(a, b, size)) pairs.push([a, b]);
        }
      }
      const [lm, gm] = pickRandom(pairs);
      return generateCyclicGraecoLatin(size, lm, gm);
    }
    case "finite": {
      const dec = primePowerDecomposition(size)!;
      const { p, k } = dec;
      if (k === 1) {
        for (let attempt = 0; attempt < 100; attempt++) {
          const mat: [[number, number], [number, number]] = [
            [randomNonZero(p), randomNonZero(p)],
            [randomNonZero(p), randomNonZero(p)],
          ];
          const result = generateFiniteFieldGraecoLatin(size, mat);
          if (result) return result;
        }
        return generateFiniteFieldGraecoLatin(size)!;
      } else {
        for (let attempt = 0; attempt < 100; attempt++) {
          const mat: [[number, number], [number, number]] = [
            [randomNonZero(size), randomNonZero(size)],
            [randomNonZero(size), randomNonZero(size)],
          ];
          const result = generateFiniteFieldGraecoLatin(size, mat);
          if (result) return result;
        }
        return generateFiniteFieldGraecoLatin(size)!;
      }
    }
    case "difference": {
      const m = (size - 1) / 3;
      return generateMethodOfDifferenceGraecoLatin(m);
    }
    case "direct": {
      // Size 12 = 3 × 4
      const cyclicPairs: [number, number][] = [];
      for (let a = 1; a < 3; a++) {
        for (let b = 1; b < 3; b++) {
          if (areMultipliersValid(a, b, 3)) cyclicPairs.push([a, b]);
        }
      }
      const [lm, gm] = pickRandom(cyclicPairs);
      const a3 = generateCyclicGraecoLatin(3, lm, gm);

      // For the 4×4 component, try finite field with random matrix or use method of differences
      const use4Methods: (() => GraecoLatinSquare | null)[] = [
        () => {
          for (let attempt = 0; attempt < 20; attempt++) {
            const mat: [[number, number], [number, number]] = [
              [randomNonZero(4), randomNonZero(4)],
              [randomNonZero(4), randomNonZero(4)],
            ];
            const result = generateFiniteFieldGraecoLatin(4, mat);
            if (result) return result;
          }
          return null;
        },
        () => generateMethodOfDifferenceGraecoLatin(1),
      ];
      const b4 = pickRandom(use4Methods)() ?? generateMethodOfDifferenceGraecoLatin(1);
      return directProductGraecoLatin(a3, b4);
    }
  }
}
