/* Makiolki Doces: cardápio, sacola e pedido pelo WhatsApp (compartilhado pelos 3 modelos) */
(function () {
  var WHATS = '5511992760370';
  var INSTA = 'https://www.instagram.com/makiolki_doces';

  var MENU = [
    { id: 'doces', cat: 'Doces', items: [
      ['cookie', 'Cookie de Nutella', 10],
      ['brig4', 'Caixa de Brigadeiro', 12, '4 unidades'],
      ['bmor', 'Brigadeirão de Morango', 17],
      ['bninho', 'Brigadeirão Ninho com Morango', 17],
      ['bferr', 'Brigadeirão Ferrero com Morango', 17],
      ['bolo', 'Fatia de Bolo', 17]
    ]},
    { id: 'taca', cat: 'Sobremesas na taça', tag: '250ml', items: [
      ['banoffee', 'Banoffee', 22, 'Farofa artesanal de bolacha, doce de leite caseiro suave, chantilly e canela.'],
      ['morangoffee', 'Morangoffee', 25, 'Farofa artesanal de bolacha, brigadeiro branco, morangos frescos, suspiro e chantilly.'],
      ['frutas', 'Makiolki Frutas vermelhas', 30, 'Creme de Ninho, geleia artesanal de frutas vermelhas, brigadeiro branco e chantilly.'],
      ['folhata', 'Folhata Italiana de Morango', 38, 'Creme 4 leites, brigadeiro branco, morango e folhata italiana.']
    ]},
    { id: 'brownie', cat: 'Brownie', items: [
      ['brnut', 'Fatia de brownie com Nutella', 16],
      ['brsorv', 'Fatia de brownie com sorvete', 25]
    ]},
    { id: 'acai', cat: 'Açaí', tag: '400ml', items: [
      ['acai', 'Açaí', 19],
      ['acaiban', 'Açaí com banana', 20],
      ['acaigra', 'Açaí com granola', 22]
    ]},
    { id: 'salgados', cat: 'Salgados', items: [
      ['esfiha', 'Mini esfiha', 10, '4 unidades'],
      ['pdq', 'Pão de queijo', 7],
      ['croiss', 'Mini croissant', 12.9, '3 unidades'],
      ['minisal', 'Mini salgados', 10.5, '4 unidades']
    ]},
    { id: 'lanches', cat: 'Lanches', items: [
      ['paoman', 'Pão com manteiga', 5.5],
      ['paoreq', 'Pão com requeijão', 5.5],
      ['misto', 'Misto quente', 16]
    ]},
    { id: 'bebidas', cat: 'Bebidas', items: [
      ['agua', 'Água', 7], ['aguagas', 'Água com gás', 7], ['h2o', 'H2O', 10],
      ['refri', 'Refrigerante', 8], ['soda', 'Soda Italiana', 16],
      ['coado', 'Café coado (P)', 5], ['expresso', 'Café expresso', 15],
      ['suco', 'Suco de Laranja', 13], ['cha', 'Chá quente', 7]
    ]}
  ];
  var SOON = ['Ciabatta de queijo e cogumelo', 'Ciabatta de salame, queijo e rúcula', 'Ciabatta de salpicão', 'Croissant'];

  var byId = {};
  MENU.forEach(function (c) { c.items.forEach(function (i) { byId[i[0]] = { name: i[1], price: i[2], cat: c.cat }; }); });

  var cart = {};
  function fmt(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function total() { var t = 0; for (var k in cart) t += cart[k] * byId[k].price; return t; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function waLink(text) { return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(text); }
  var GREETING = 'Olá! Vi seu perfil no insta e quero conhecer seus produtos';

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function message() {
    var lines = ['Olá, Makiolki! Quero fazer um pedido pelo site:', ''];
    for (var k in cart) lines.push('• ' + cart[k] + 'x ' + byId[k].name + ' (' + fmt(cart[k] * byId[k].price) + ')');
    lines.push('', 'Total: ' + fmt(total()));
    var nome = val('mk-nome'), modo = val('mk-modo'), quando = val('mk-quando'), obs = val('mk-obs');
    if (nome) lines.push('Nome: ' + nome);
    if (modo) lines.push(modo);
    if (quando) lines.push('Quando: ' + quando);
    if (obs) lines.push('Obs: ' + obs);
    return lines.join('\n');
  }

  /* Monta o cardápio. opts.controls = true mostra os botões de quantidade */
  function renderMenu(root, opts) {
    opts = opts || {};
    var html = '';
    MENU.forEach(function (c) {
      html += '<section class="mk-cat" data-cat="' + c.id + '" id="cat-' + c.id + '">' +
        '<h3 class="mk-cat-title"><span>' + esc(c.cat) + '</span>' + (c.tag ? '<span class="mk-tag">' + c.tag + '</span>' : '') + '</h3><ul class="mk-items">';
      c.items.forEach(function (i) {
        html += '<li class="mk-item" data-id="' + i[0] + '"><div class="mk-info"><span class="mk-name">' + esc(i[1]) + '</span>' +
          (i[3] ? '<span class="mk-desc">' + esc(i[3]) + '</span>' : '') + '</div>' +
          '<span class="mk-dots" aria-hidden="true"></span><span class="mk-price">' + fmt(i[2]) + '</span>' +
          (opts.controls !== false ? '<div class="mk-qty"><button type="button" class="mk-minus" aria-label="Tirar ' + esc(i[1]) + '">−</button>' +
          '<output aria-live="polite">0</output><button type="button" class="mk-plus" aria-label="Adicionar ' + esc(i[1]) + '">+</button></div>' : '') +
          '</li>';
      });
      html += '</ul>';
      if (c.id === 'lanches' && opts.soon !== false) {
        html += '<div class="mk-soon"><span class="mk-tag">Em breve</span><p>' + SOON.map(esc).join(' · ') + '</p></div>';
      }
      html += '</section>';
    });
    root.innerHTML = html;
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var li = b.closest('.mk-item'); if (!li) return;
      var id = li.dataset.id;
      if (b.classList.contains('mk-plus')) cart[id] = (cart[id] || 0) + 1;
      if (b.classList.contains('mk-minus') && cart[id]) { cart[id]--; if (!cart[id]) delete cart[id]; }
      li.classList.remove('mk-bump'); void li.offsetWidth; li.classList.add('mk-bump');
      update();
    });
  }

  /* Abas que filtram categorias. "Tudo" mostra todas */
  function renderTabs(root, menuRoot) {
    var tabs = [{ id: 'all', cat: 'Tudo' }].concat(MENU);
    root.innerHTML = tabs.map(function (t, i) {
      return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-tab="' + t.id + '">' + esc(t.cat) + '</button>';
    }).join('');
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      root.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      var t = b.dataset.tab;
      menuRoot.querySelectorAll('.mk-cat').forEach(function (s) { s.hidden = t !== 'all' && s.dataset.cat !== t; });
    });
  }

  function update() {
    document.querySelectorAll('.mk-item').forEach(function (li) {
      var q = cart[li.dataset.id] || 0;
      var o = li.querySelector('output'); if (o) o.textContent = q;
      li.classList.toggle('mk-on', q > 0);
    });
    var n = count(), t = total();
    var sum = document.getElementById('mk-summary');
    if (sum) {
      sum.innerHTML = n ? Object.keys(cart).map(function (k) {
        return '<li><span>' + cart[k] + '× ' + esc(byId[k].name) + '</span><span>' + fmt(cart[k] * byId[k].price) + '</span></li>';
      }).join('') : '<li class="mk-empty">Sua sacola está vazia. Toque no + dos itens do cardápio.</li>';
    }
    document.querySelectorAll('[data-mk="total"]').forEach(function (el) { el.textContent = fmt(t); });
    document.querySelectorAll('[data-mk="count"]').forEach(function (el) { el.textContent = n + (n === 1 ? ' item' : ' itens'); });
    var bar = document.getElementById('mk-bar'); if (bar) bar.classList.toggle('mk-show', n > 0);
    var send = document.getElementById('mk-send');
    if (send) { send.href = n ? waLink(message()) : waLink(GREETING); send.classList.toggle('mk-disabled', !n); }
    var prev = document.getElementById('mk-preview'); if (prev) prev.textContent = n ? message() : '';
  }

  function init() {
    document.querySelectorAll('[data-mk="whats"]').forEach(function (a) { a.href = waLink(GREETING); a.target = '_blank'; a.rel = 'noopener'; });
    document.querySelectorAll('[data-mk="insta"]').forEach(function (a) { a.href = INSTA; a.target = '_blank'; a.rel = 'noopener'; });
    var send = document.getElementById('mk-send'); if (send) { send.target = '_blank'; send.rel = 'noopener'; }
    ['mk-nome', 'mk-modo', 'mk-quando', 'mk-obs'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.addEventListener('input', update);
    });
    var form = document.getElementById('mk-form'); if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
    update();
  }

  window.MK = { MENU: MENU, renderMenu: renderMenu, renderTabs: renderTabs, init: init, fmt: fmt };
})();
