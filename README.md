[README.md](https://github.com/user-attachments/files/31870111/README.md)
# 🎈 Projeto Pula-Pula — Sistema de Reservas

Sistema web para clientes reservarem brinquedos infláveis (pula-pula, piscina de bolinhas, etc.) para festas, com cálculo automático de valores, verificação de disponibilidade por data e envio do pedido direto para o WhatsApp.

## Funcionalidades

- **Cadastro do cliente**: nome, WhatsApp e data de nascimento.
- **Vitrine de brinquedos**: cards com foto, tamanho e preço de cada item disponível.
- **Verificação de disponibilidade**: ao escolher a data da festa, o sistema consulta o banco de dados e bloqueia automaticamente os brinquedos já reservados naquele dia.
- **Cálculo de frete por bairro**: seleção de região com valor de frete pré-definido, mais campo de endereço detalhado.
- **Resumo em tempo real**: soma automática de brinquedos + frete = total.
- **Envio via WhatsApp**: ao confirmar, a reserva é salva no banco e uma mensagem formatada é aberta no WhatsApp para o cliente confirmar o pedido.

## Tecnologias

- HTML, CSS e JavaScript puro (sem frameworks/build step).
- [Firebase Realtime Database](https://firebase.google.com/docs/database) para armazenar as reservas.

## Estrutura

```
Projeto-pula-pula-main/
├── index.html          # aplicação completa (HTML + CSS + JS)
├── Piscina-de-bolinhas.jpg
├── 38bf36f0-...jpeg    # foto do Pula-Pula
└── ad9d1d1a-...jpg     # foto do Combo
```

## Como usar

1. Basta abrir o `index.html` em um navegador (ou hospedar em qualquer serviço de páginas estáticas, como GitHub Pages, Netlify, Vercel etc.).
2. As credenciais do Firebase já estão configuradas no arquivo. Para usar com **seu próprio banco de dados**, substitua o objeto `firebaseConfig` no `<script>` pelo do seu projeto Firebase.
3. No Firebase, garanta que o Realtime Database tenha um nó `reservas` (criado automaticamente na primeira reserva).

## Modelo de dados (Firebase — nó `reservas`)

Cada reserva salva um registro por brinquedo escolhido:

| Campo        | Tipo    | Descrição                                                  |
|--------------|---------|-------------------------------------------------------------|
| `cliente`    | string  | Nome do cliente                                              |
| `telefone`   | string  | WhatsApp do cliente                                          |
| `data`       | string  | Data da festa (`AAAA-MM-DD`)                                 |
| `dataPedido` | string  | Data/hora em que a reserva foi feita                         |
| `brinquedo`  | string  | Nome do item reservado                                       |
| `valorTotal` | number  | Valor total da reserva (brinquedos + frete) dividido pelos itens escolhidos |
| `frete`      | number  | Valor do frete dividido entre os itens (usado para calcular o lucro no painel admin) |
| `endereco`   | string  | Endereço completo + bairro/região                            |
| `pago`       | boolean | Status de pagamento (atualizado pelo painel admin)           |

> O painel administrativo (repositório separado) lê esses mesmos dados para gerar relatórios, gráficos de lucro e controle de pagamentos.

## Personalização

- **Brinquedos e preços**: edite os cards na seção `.vitrine` e o atributo `data-preco` de cada checkbox.
- **Regiões e frete**: edite as `<option>` do `<select id="bairro">` e o atributo `data-frete`.
- **Número de WhatsApp de destino**: altere o número em `window.open(\`https://wa.me/55...\`)` dentro da função `salvarEEnviar()`.

## Projeto relacionado

- [Painel Administrador](../administrador-pula-pula-main) — visualização e gestão das reservas, edição manual de valores e gráfico de lucro mensal.
