# JF Studio
Site em creme e terracota, com início e catálogo em páginas separadas.

## Publicação
Envie index.html, catalogo.html, style.css, app.js, config.js e produtos.js para a raiz do repositório. Envie a pasta assets inteira, mantendo assets/fonts e assets/produtos. Substitua os arquivos anteriores.

## Catálogo
O catálogo começa vazio. Busca e categorias continuam visíveis. Edite produtos.js para cadastrar suas peças, e coloque fotos em assets/produtos. Campos: id, name, category, description, image. Categorias são configuradas em config.js; categorias de produtos também entram nos filtros automaticamente.

Exemplo de cadastro (não está ativo no site):
```js
window.JF_PRODUCTS = [{id:"peca-1", name:"Nome da sua peça", category:"Articulados", description:"Sua descrição", image:"assets/produtos/sua-foto.jpg"}];
```

O pedido fica salvo no navegador e pode ser enviado ao WhatsApp 48 99694-2186. O robô do início é uma imagem de apresentação. Não há produtos demonstrativos no catálogo ou nas categorias. Não há painel de cadastro; os dados são editados nos arquivos do repositório.
