/* Estrutura fixa do vault (hardcode).
   As arestas viram bidirecionais: se A referencia B, B também "aponta" para A. */
const VAULT = (() => {
  const nodes = {
    "index": { title: "Privacidade na era Web3", url: "index.html" }
  };

  const cited = [];

  const edges = [];
  const seen = new Set();
  for (const [a, b] of cited) {
    if (!seen.has(a + "->" + b)) { seen.add(a + "->" + b); edges.push([a, b]); }
    if (!seen.has(b + "->" + a)) { seen.add(b + "->" + a); edges.push([b, a]); }
  }

  return { nodes, edges };
})();
