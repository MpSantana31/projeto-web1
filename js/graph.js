const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;
let zoomAtual = 1;

function vizinhos(id) {
  let v = [];
  for (let i = 0; i < VAULT.edges.length; i++) {
    if (VAULT.edges[i][0] == id) {
      v.push(VAULT.edges[i][1]);
    }
  }
  return v;
}

function ordemDeBrotado(page) {
  let lista = [];
  let vistos = new Set([page]);
  let fronteira = [page];
  while (fronteira.length > 0) {
    let proxima = [];
    for (let i = 0; i < fronteira.length; i++) {
      let viz = vizinhos(fronteira[i]);
      for (let j = 0; j < viz.length; j++) {
        if (vistos.has(viz[j])) {
          continue;
        }
        vistos.add(viz[j]);
        lista.push({ id: viz[j], pai: fronteira[i] });
        proxima.push(viz[j]);
      }
    }
    fronteira = proxima;
  }
  return lista;
}

function desenharGrafo() {
  let container = document.getElementById('graph');
  if (container == null) {
    return;
  }

  let page = container.getAttribute('data-page');

  let largura = container.clientWidth;
  if (largura < 50) {
    largura = 320;
  }
  let altura = container.clientHeight - 2;
  if (altura < 50) {
    altura = 278;
  }

  let nos = {};
  let ids = Object.keys(VAULT.nodes);
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    nos[id] = {
      id: id,
      title: VAULT.nodes[id].title,
      val: id == page ? 10 : 5,
      url: VAULT.nodes[id].url,
      atual: id == page,
      nascimento: null,
      emGrafo: false
    };
  }

  nos[page].nascimento = Date.now();
  nos[page].emGrafo = true;
  let mostrados = [nos[page]];
  let ligas = [];
  let chaves = new Set();

  let fila = [];
  if (page == 'index') {
    fila = ordemDeBrotado(page);
  } else {
    let vistos = new Set();
    for (let i = 0; i < VAULT.edges.length; i++) {
      let a = VAULT.edges[i][0];
      let b = VAULT.edges[i][1];
      if (a == page && !vistos.has(b)) {
        vistos.add(b);
        fila.push({ id: b, pai: page });
      }
    }
  }

  if (VAULT.refs && VAULT.refs[page]) {
    let refs = VAULT.refs[page];
    for (let i = 0; i < refs.length; i++) {
      let r = refs[i];
      nos[r.id] = {
        id: r.id,
        title: r.title,
        val: 3,
        url: r.url,
        atual: false,
        nascimento: null,
        emGrafo: false
      };
      fila.push({ id: r.id, pai: page });
    }
  }

  let g = ForceGraph()(container)
    .graphData({ nodes: mostrados, links: ligas })
    .width(largura)
    .height(altura)
    .backgroundColor('rgba(0,0,0,0)')
    .minZoom(0.4)
    .maxZoom(8)
    .nodeRelSize(5)
    .nodeCanvasObjectMode(() => 'replace')

    .onZoom(transform => {
      zoomAtual = transform.k;
    })

    .onNodeHover(node => {
      highlightNodes.clear();
      highlightLinks.clear();
      if (node) {
        highlightNodes.add(node);
        ligas.forEach(link => {
          if (link.source === node || link.target === node) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
        });
      }
      hoverNode = node || null;
      document.body.style.cursor = node ? 'pointer' : null;
    })

    .nodeCanvasObject((node, ctx, globalScale) => {
      let fator = Math.min(1, (Date.now() - node.nascimento) / 250);
      const label = node.title;
      const raio = node.val * 0.8 * fator;
      const isHighlighted = highlightNodes.has(node);
      const isDimmed = hoverNode && !isHighlighted;

      if (raio > 0.5) {
        if (node === hoverNode) {
          ctx.shadowColor = 'rgba(184, 87, 244, 0.85)';
          ctx.shadowBlur = 18 / globalScale;
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, raio, 0, 2 * Math.PI, false);
        ctx.fillStyle = isDimmed ? '#444444' : (node.atual || node === hoverNode ? '#ffffff' : '#999999');
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (zoomAtual > 1.3 || node === hoverNode) {
        ctx.font = (8 / globalScale) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.globalAlpha = fator;
        ctx.fillStyle = isDimmed ? '#555555' : (node.atual || node === hoverNode ? '#ffffff' : '#999999');
        ctx.fillText(label, node.x, node.y + raio + 3 / globalScale);
        ctx.globalAlpha = 1;
      }
    })

    .linkColor(link => highlightLinks.has(link) ? '#b18aff' : 'rgba(177, 138, 255, 0.25)')
    .linkWidth(link => highlightLinks.has(link) ? 2 : 1)

    .onNodeClick(node => {
      window.location.href = node.url;
    });

  let brotou = false;

  let encaixar = function () {
    if (!brotou) {
      return;
    }
    g.zoomToFit(600, 60);
  };
  g.onEngineStop(encaixar);

  let indice = 0;
  let brotar = setInterval(function () {
    if (indice >= fila.length) {
      clearInterval(brotar);
      brotou = true;
      return;
    }
    let item = fila[indice];
    indice = indice + 1;

    let novo = nos[item.id];
    novo.nascimento = Date.now();
    novo.emGrafo = true;

    let pai = nos[item.pai];
    novo.x = pai.x + (Math.random() * 40 - 20);
    novo.y = pai.y + (Math.random() * 40 - 20);

    mostrados.push(novo);
    ligas = [];
    chaves = new Set();
    for (let i = 0; i < VAULT.edges.length; i++) {
      let a = VAULT.edges[i][0];
      let b = VAULT.edges[i][1];
      if (!nos[a].emGrafo || !nos[b].emGrafo) {
        continue;
      }
      if (chaves.has(a + '|' + b) || chaves.has(b + '|' + a)) {
        continue;
      }
      chaves.add(a + '|' + b);
      ligas.push({ source: a, target: b });
    }

    if (VAULT.refs && VAULT.refs[page]) {
      let refs = VAULT.refs[page];
      for (let i = 0; i < refs.length; i++) {
        if (nos[refs[i].id].emGrafo) {
          ligas.push({ source: page, target: refs[i].id });
        }
      }
    }

    g.graphData({ nodes: mostrados, links: ligas });
  }, 250);
}

function desenharBacklinks() {
  let lista = document.getElementById('backlinks');
  if (lista == null) {
    return;
  }

  let page = lista.getAttribute('data-page');
  let edges = VAULT.edges;

  for (let i = 0; i < edges.length; i++) {
    if (edges[i][1] == page) {
      let origem = edges[i][0];
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.setAttribute('href', VAULT.nodes[origem].url);
      a.textContent = VAULT.nodes[origem].title;
      li.appendChild(a);
      lista.appendChild(li);
    }
  }
}

desenharGrafo();
desenharBacklinks();
