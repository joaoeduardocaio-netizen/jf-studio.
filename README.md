# JF Studio — preto e cobre
Layout baseado na referência aprovada com a impressora produzindo um suporte Baby Groot.

## Publicar
Substitua os arquivos index.html, catalogo.html, style.css, app.js, config.js e produtos.js na raiz do repositório. Envie a pasta assets completa, preservando subpastas. As imagens novas estão em assets/hero-groot.webp e assets/jf-logo-preto-cobre.png. A home tem uma prévia do catálogo; Catálogo abre uma página própria. Busca e categorias funcionam nas duas páginas.

## Adicionar peças
O catálogo inicia vazio. Coloque suas fotos em assets/produtos e cadastre em produtos.js. Campos: id, name, category, description, image. Exemplo de estrutura (não aparece no site):
```js
window.JF_PRODUCTS = [{id:"peca-1", name:"Sua peça", category:"Articulados", description:"Sua descrição", image:"assets/produtos/foto.jpg"}];
```
Categorias configuradas em config.js; novas categorias dos produtos também entram no filtro. O botão de ajustes ao lado dos filtros abre todas as categorias. Preços não foram cadastrados.

## Pedido
O pedido fica salvo neste navegador e é enviado para o WhatsApp 48 99694-2186. A opção Personalizados permite descrever uma ideia. Não há painel administrativo nesta versão; o cadastro é feito nos arquivos.

## Imagens e validação
A cena da impressora é ilustrativa. O layout utiliza HTML/CSS e ícones SVG funcionais; imagens de referência geradas não são capturas de navegador. Busca, filtros, navegação e pedido foram verificados por testes de comportamento. Conferir visualmente no celular após publicação.
