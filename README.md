# JF Studio

Site estático preto e cobre com catálogo online, painel administrativo,
galerias de fotos e vídeos, preços opcionais, categorias, destaques e pedido via WhatsApp.

Acesse `admin.html` para gerenciar o catálogo. Leia `COMO-PUBLICAR.txt`.
O projeto Supabase próprio da JF já foi criado com tabelas e armazenamento.
Falta cadastrar e autorizar a conta do proprietário. Nenhum produto de exemplo foi criado.

## Permissões

As três tabelas públicas têm RLS. Apenas usuários da tabela `jf_admins`
podem cadastrar/editar/excluir produtos, categorias ou arquivos.
Visitantes leem apenas produtos publicados. O cadastro de conta não concede papel admin.
A chave de config.js é pública; não inclui service_role ou chave secreta.
Para autorizar uma conta já cadastrada, o responsável pelo banco usa:

```sql
insert into public.jf_admins(user_id)
select id from auth.users where lower(email) = lower('EMAIL_DO_PROPRIETARIO')
on conflict do nothing;
```

Execute somente com o e-mail do proprietário confirmado. Confira que uma linha foi inserida.
Configure em Authentication > URL Configuration a URL publicada e `admin.html`
como redirecionamento permitido para confirmação e recuperação de senha.
A senha é escolhida pelo proprietário e não deve ser enviada a ninguém.

`banco-jf.sql` é um registro do schema instalado; não deve ser reaplicado.
O bucket jf-media é público para exibir fotos e vídeos no site.
Mídias de rascunhos também têm URL pública se conhecida; use apenas material destinado à divulgação.
O painel apaga mídias removidas após salvar o produto e tenta limpar uploads se o salvamento falhar.
Fotos e vídeos são transmitidos ao armazenamento online; não ficam apenas no navegador.
O catálogo consulta o banco ao abrir a página; quem já estiver com a página aberta precisa recarregar.

## Arquivos

- `dados.js`: cliente de dados e armazenamento.
- `admin.html`, `admin.js`, `admin.css`: painel.
- `app.js`: vitrine, galerias e pedidos.
- `produtos.js`: catálogo legado vazio, usado só se o banco não estiver configurado.
- `assets/vendor/supabase-2.117.2.js`: SDK fixado, servido localmente.

O layout e a imagem de capa da versão aprovada foram preservados.
