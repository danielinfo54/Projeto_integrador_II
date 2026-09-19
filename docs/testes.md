# Relatório de Validação e Testes

Testes realizados sobre o sistema **Sistema de Denúncias e Ocorrências Escolares**, publicado em: https://danielinfo54.github.io/Projeto_integrador_II/

Todos os 10 testes planejados foram executados no sistema publicado e **passaram com sucesso**, validando o funcionamento completo do registro, consulta, atualização de status, providências, resolução e comportamento do relato anônimo, com os dados sendo efetivamente armazenados e recuperados do Firebase Firestore.

## Quadro de testes

| # | Teste | Procedimento | Resultado esperado | Resultado obtido | Situação |
|---|---|---|---|---|---|
| 1 | Criar ocorrência identificada | Na aba "Registrar Ocorrência", selecionar "Identificado", preencher nome, perfil, categoria, local e descrição, e enviar | Sistema exibe o protocolo gerado; documento criado em `ocorrencias` com `nome` e `perfil` preenchidos | Protocolo exibido corretamente; documento criado no Firestore com os dados identificados | ✅ Passou |
| 2 | Criar ocorrência anônima | Selecionar "Anônimo", preencher categoria, local e descrição, e enviar | Sistema exibe o protocolo; documento criado com `nome` e `perfil` como `null` | Protocolo exibido; documento criado com `nome` e `perfil` vazios | ✅ Passou |
| 3 | Verificar ocorrência no Firestore | Após os testes 1 e 2, abrir o console do Firebase → Firestore → coleção `ocorrencias` | Os dois documentos aparecem com os dados corretos | Documentos confirmados no console do Firebase | ✅ Passou |
| 4 | Consultar ocorrência por protocolo | Na aba "Acompanhar Ocorrência", inserir o protocolo do Teste 1 e clicar em "Consultar" | Sistema exibe categoria, local, status e linha do tempo | Consulta retornou todos os dados corretamente | ✅ Passou |
| 5 | Alterar status da ocorrência | Na Área Administrativa (senha `admin123`), abrir uma ocorrência, mudar o status para "Em análise" e salvar | Status atualizado na tabela e no Firestore; novo item no `historico` | Status atualizado na tela e no banco de dados | ✅ Passou |
| 6 | Registrar providência | No detalhe da ocorrência, preencher "Registrar providência" e salvar | Texto salvo no campo `providencias` e exibido na lista | Providência salva e exibida corretamente | ✅ Passou |
| 7 | Registrar resolução | Alterar status para "Resolvida" preenchendo a providência com a descrição da resolução | Campo `resolucao` salvo e exibido na consulta pública | Resolução salva e visível na aba "Acompanhar" | ✅ Passou |
| 8 | Verificar histórico de status | Fazer duas ou mais mudanças de status na mesma ocorrência e consultar na aba "Acompanhar" | Linha do tempo mostra todas as mudanças, em ordem, com data e hora | Histórico completo exibido corretamente | ✅ Passou |
| 9 | Validação de campos obrigatórios | Tentar enviar uma ocorrência sem preencher "Localização" ou "Descrição" | Sistema exibe alerta e não envia a ocorrência | Alerta exibido; ocorrência não foi enviada | ✅ Passou |
| 10 | Comportamento do relato anônimo | Registrar uma ocorrência anônima e conferir na Área Administrativa | Ocorrência aparece normalmente, mas sem nome/perfil visível (marcada como "Anônimo") | Ocorrência exibida como "Anônimo", sem identificação do autor | ✅ Passou |

## Resumo

| Total de testes | Passou | Falhou |
|---|---|---|
| 10 | 10 | 0 |

## Conclusão

Todos os testes funcionais planejados para esta etapa foram executados com sucesso, sem falhas identificadas. O sistema demonstrou estar apto a atender aos requisitos funcionais definidos (RF01 a RF10), com o banco de dados Firebase Firestore integrado corretamente ao front-end e funcionando em ambiente de produção (Firebase Hosting).
