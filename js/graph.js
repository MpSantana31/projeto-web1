const W = 640;
const H = 480;
const CX = 320;
const CY = 240;

function desenharBolinha(svg, x, y, raio, titulo, url, classe) {
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", classe);

  let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", raio);
  g.appendChild(c);

  let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  txt.setAttribute("x", x);
  txt.setAttribute("y", y + raio + 14);
  txt.setAttribute("text-anchor", "middle");
  txt.setAttribute("class", "glabel");
  txt.textContent = titulo;
  g.appendChild(txt);

  g.addEventListener("click", function () {
    window.location.href = url;
  });

  svg.appendChild(g);
}

function desenharGrafo() {
  let container = document.getElementById("local-graph");
  if (container == null) {
    return;
  }

  let page = container.getAttribute("data-page");
  let nos = VAULT.nodes;
  let ids = Object.keys(nos);

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  svg.setAttribute("class", "graph-svg");

  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    if (id == page) {
      let raio = 26;
      desenharBolinha(svg, CX, CY, raio, nos[id].title, nos[id].url, "gnode current");
    }
  }

  container.appendChild(svg);
}

function desenharBacklinks() {
  let lista = document.getElementById("backlinks");
  if (lista == null) {
    return;
  }

  let page = lista.getAttribute("data-page");
  let edges = VAULT.edges;

  for (let i = 0; i < edges.length; i++) {
    if (edges[i][1] == page) {
      let origem = edges[i][0];
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.setAttribute("href", VAULT.nodes[origem].url);
      a.textContent = VAULT.nodes[origem].title;
      li.appendChild(a);
      lista.appendChild(li);
    }
  }
}

window.onload = function () {
  desenharGrafo();
  desenharBacklinks();
};
