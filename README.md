# Projeto Integrador II

## Sistema de Denúncias e Ocorrências Escolares

🔗 **Site publicado:** https://danielinfo54.github.io/Projeto_integrador_II/

---

## Sobre o projeto

Este projeto tem como objetivo desenvolver um sistema para facilitar a comunicação de problemas e situações que necessitam de atenção dentro do ambiente escolar.

A plataforma permite que alunos, professores e funcionários registrem ocorrências relacionadas à estrutura, segurança, conservação e outras situações inadequadas que estejam acontecendo na escola. O usuário também pode optar por realizar o relato de forma anônima.

## Problema

No ambiente escolar podem ocorrer diversos problemas que precisam ser comunicados aos responsáveis, como problemas estruturais, falhas em equipamentos, questões relacionadas à segurança, conservação do ambiente e outras situações inadequadas.

A ausência de um canal organizado para registrar essas ocorrências pode dificultar a comunicação e o acompanhamento das providências necessárias.

## Objetivo

Criar um sistema que permita registrar ocorrências e problemas encontrados na escola, possibilitando o envio de relatos identificados ou anônimos e permitindo o acompanhamento do andamento das ocorrências.

## Público-alvo

* Alunos;
* Professores;
* Funcionários da escola;
* Responsáveis pela administração escolar.

## Funcionalidades

* Registro de ocorrências;
* Possibilidade de realizar relatos de forma anônima;
* Seleção da categoria da ocorrência;
* Registro do local da ocorrência;
* Descrição detalhada da situação;
* Registro automático da data da ocorrência;
* Consulta de ocorrências por número de protocolo;
* Acompanhamento do status;
* Registro das providências tomadas;
* Registro da resolução da ocorrência;
* Histórico de mudanças de status;
* Área administrativa protegida por senha.

## Categoria de ocorrências

As ocorrências são classificadas em categorias:

* Estrutura e infraestrutura;
* Segurança;
* Limpeza e conservação;
* Equipamentos;
* Situações inadequadas;
* Outros.

## Status das ocorrências

As ocorrências podem apresentar os seguintes status:

* Recebida;
* Em análise;
* Em providência;
* Resolvida;
* Arquivada (quando a administração analisa e entende que a ocorrência não procede).

Fluxo: `Recebida` → `Em análise` → `Em providência` → `Resolvida`, ou `Em análise` → `Arquivada`.

---

## Tecnologias utilizadas

* **HTML5**
* **CSS3**
* **JavaScript** (puro, sem frameworks)
* **Firebase Firestore** (banco de dados)
* **GitHub Pages** (publicação do site)

Não foram utilizados frameworks (React/Vue/Angular) nem back-end próprio (Node.js/PHP), mantendo o projeto simples e adequado ao escopo de um Projeto Integrador.

## Estrutura do projeto

```
src/
├── index.html            # Estrutura das telas (Registrar, Acompanhar, Admin)
├── style.css             # Estilização
├── script.js              # Lógica do sistema e integração com o Firestore
└── firebase-config.js    # Configuração e inicialização do Firebase
docs/
└── testes.md              # Relatório de validação e testes
```

## Banco de dados (Firebase Firestore)

O banco de dados foi modelado em coleções e documentos, adaptando a modelagem relacional definida na Etapa 2 para o formato do Firestore:

| Coleção | Descrição |
|---|---|
| `ocorrencias` | Documento principal de cada ocorrência (categoria, local, descrição, status, histórico, providências) |
| `usuarios` | Cadastro de usuários (uso futuro/expansão) |
| `categorias` | Lista de categorias (referência) |
| `providencias` | Reservada para expansão futura — atualmente as providências ficam registradas dentro do próprio documento da ocorrência, como lista |

Cada documento de `ocorrencias` guarda, entre outros campos: `categoria`, `local`, `descricao`, `status`, `anonimo`, `historico` (lista com cada mudança de status e data) e `providencias` (lista de providências tomadas).

Quando o relato é anônimo, os campos `nome` e `perfil` não são preenchidos no documento, garantindo que a identidade do autor não fique disponível para a administração.


## Site publicado

O projeto está publicado via **GitHub Pages**, disponível em:

**https://danielinfo54.github.io/Projeto_integrador_II/**

## Acesso à área administrativa

Para acessar a Área Administrativa (visualizar ocorrências, atualizar status e registrar providências), utilize a senha de demonstração:

```
admin123
```

> Esta senha é fixa no código (`script.js`), apenas para fins de demonstração do protótipo. Não representa uma prática de segurança adequada para um ambiente de produção real — em uma versão futura, o ideal seria substituir por com login individual por administrador.

---

## Resultados finais

O sistema atende a todos os requisitos funcionais definidos na Etapa 1 (registro de ocorrências, relato anônimo, categorização, consulta, atualização de status, registro de providências e resolução), com o banco de dados real (Firebase Firestore) integrado e funcionando em produção.

Os testes de validação realizados estão documentados em [`docs/testes.md`](docs/testes.md).

## Documentação completa

* Requisitos e arquitetura: documentos das Etapas 1 e 2 (neste repositório)
* Relatório de testes: [`docs/testes.md`](docs/testes.md)
* Gestão do projeto: quadro Trello (link abaixo)
https://trello.com/b/RQppRCI5/sistema-de-denuncias-e-ocorrencias-escolares

## Autor

Daniel Expedito Hipólito Bezerra
Curso Técnico de Informática — Projeto Integrador 

