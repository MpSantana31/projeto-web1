/* Estrutura fixa do vault (hardcode).
   As arestas viram bidirecionais: se A referencia B, B também "aponta" para A. */
const VAULT = (() => {
  const nodes = {
    "index":        { title: "Início",                  url: "index.html" },
    "privacidade":  { title: "Privacidade na Web3",     url: "privacidade.html" },
    "vigilancia":   { title: "Vigilância Estatal",      url: "vigilancia.html" },
    "historia":     { title: "História da web",         url: "historia.html" },
    "blockchain":   { title: "Blockchain",              url: "blockchain.html" },
    "bitcoin":      { title: "Bitcoin",                 url: "bitcoin.html" },
    "armazenamento":{ title: "Armaz. Descentralizado",  url: "armazenamento.html" },
    "carteiras":    { title: "Carteiras e Chaves",      url: "carteiras.html" },
    "identidade":   { title: "Identidade Autossoberana", url: "identidade.html" },
    "defi":         { title: "DeFi Privado",            url: "defi.html" },
    "casos":        { title: "Casos Reais",             url: "casos.html" },
    "ethereum":     { title: "Ethereum",                url: "ethereum.html" },
    "sobre":        { title: "Sobre o Projeto",         url: "sobre.html" }
  };

  const cited = [
    ["index", "sobre"],
    ["index", "privacidade"],
    ["index", "historia"],
    ["index", "bitcoin"],
    ["index", "identidade"],
    ["historia", "privacidade"],
    ["vigilancia", "privacidade"],
    ["vigilancia", "defi"],
    ["vigilancia", "identidade"],
    ["historia", "ethereum"],
    ["historia", "blockchain"],
    ["ethereum", "privacidade"],
    ["ethereum", "defi"],
    ["blockchain", "ethereum"],
    ["blockchain", "privacidade"],
    ["bitcoin", "blockchain"],
    ["bitcoin", "privacidade"],
    ["bitcoin", "ethereum"],
    ["armazenamento", "blockchain"],
    ["armazenamento", "privacidade"],
    ["carteiras", "ethereum"],
    ["carteiras", "privacidade"],
    ["carteiras", "historia"],
    ["identidade", "carteiras"],
    ["identidade", "privacidade"],
    ["defi", "carteiras"],
    ["defi", "privacidade"],
    ["defi", "identidade"],
    ["defi", "armazenamento"],
    ["casos", "carteiras"],
    ["casos", "defi"],
    ["casos", "privacidade"]
  ];

  const edges = [];
  const seen = new Set();
  for (const [a, b] of cited) {
    if (!seen.has(a + "->" + b)) { seen.add(a + "->" + b); edges.push([a, b]); }
    if (!seen.has(b + "->" + a)) { seen.add(b + "->" + a); edges.push([b, a]); }
  }

  const refs = {
    sobre: [
      { id: "obsidian",    title: "Obsidian",    url: "https://obsidian.md" },
      { id: "metamask",    title: "MetaMask",    url: "https://metamask.io" },
      { id: "ethereumorg", title: "ethereum.org", url: "https://ethereum.org" },
      { id: "uniswap",     title: "Uniswap",     url: "https://uniswap.org" },
      { id: "polymarket",  title: "Polymarket",  url: "https://polymarket.com" },
      { id: "hyperliquid", title: "Hyperliquid", url: "https://hyperliquid.xyz" }
    ]
  };

  return { nodes, edges, refs };
})();
