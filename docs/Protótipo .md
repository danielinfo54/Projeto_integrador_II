# Arquitetura do Sistema

## Sistema de Denúncias e Ocorrências Escolares — Etapa 2

Este documento reúne o **Diagrama de Fluxo com Regras de Negócio**, o **Modelo de Banco de Dados (ER)** e a **Estrutura de Pastas** do repositório, servindo como base para a fase de modelagem e desenvolvimento do sistema.

---

## 0. Diagrama de Fluxo do Processo Principal (Visão Geral)

O fluxo abaixo representa o caminho completo de uma ocorrência, desde o registro pelo usuário até a resolução final, incluindo pontos de decisão, validações, aprovações e retornos (loops de correção/acompanhamento). Este é o diagrama "macro" — a seção seguinte detalha cada uma dessas etapas passo a passo.

```mermaid
flowchart TD
    A[Usuário acessa o sistema] --> B{Deseja se identificar?}
    B -->|Sim| C[Preenche dados de identificação]
    B -->|Não| D[Segue como anônimo]
    C --> E[Seleciona categoria da ocorrência]
    D --> E
    E --> F[Informa localização]
    F --> G[Descreve a situação]
    G --> H[Sistema registra data automaticamente]
    H --> I{Dados obrigatórios preenchidos corretamente?}
    I -->|Não| J[Sistema solicita correção dos dados]
    J --> E
    I -->|Sim| K["Ocorrência enviada (Status: Recebida)"]
    K --> L[Administração recebe notificação]
    L --> M["Administração analisa a ocorrência (Status: Em análise)"]
    M --> N{Ocorrência procede?}
    N -->|Não| O["Registra motivo do arquivamento (Status: Arquivada)"]
    N -->|Sim| P["Define providências necessárias (Status: Em providência)"]
    P --> Q[Executa providência]
    Q --> R{Problema foi resolvido?}
    R -->|Não| S[Atualiza providência/observações]
    S --> Q
    R -->|Sim| T["Registra resolução (Status: Resolvida)"]
    T --> U[Notifica encerramento da ocorrência]
    O --> U
    U --> V[Fim]
```

### Regras de negócio aplicadas ao fluxo

| Regra | Descrição |
|---|---|
| RN01 | O usuário deve escolher, antes de prosseguir, entre relato identificado ou anônimo. |
| RN02 | Todos os campos obrigatórios (categoria, localização, descrição) devem ser preenchidos; caso contrário, o sistema retorna a etapa de preenchimento. |
| RN03 | A data de registro é gerada automaticamente pelo sistema, não podendo ser editada pelo usuário. |
| RN04 | Toda ocorrência enviada entra automaticamente com status **Recebida**. |
| RN05 | Somente a administração pode alterar o status de uma ocorrência. |
| RN06 | Uma ocorrência analisada pode ser **arquivada** (caso não proceda) ou seguir para **providência**. |
| RN07 | Uma ocorrência pode receber mais de uma providência até ser considerada resolvida (loop de acompanhamento). |
| RN08 | A identidade do usuário anônimo nunca é exposta à administração durante o processo. |
| RN09 | O status **Resolvida** só pode ser atribuído após o registro da providência que solucionou o problema. |

---

## 1. Diagrama de Fluxo Detalhado (Passo a Passo)

Este segundo diagrama "abre" cada etapa do fluxo macro em ações menores e mais concretas — o tipo de detalhamento que ajuda na hora de desenhar as telas e as validações do sistema.

```mermaid
flowchart TD
    A0[Início: usuário acessa o sistema] --> A1{Já possui cadastro?}
    A1 -->|Não, e quer se identificar| A2[Cadastro rápido: nome, e-mail, perfil]
    A1 -->|Sim, faz login| A3[Login]
    A1 -->|Não quer se identificar| A4[Segue direto como anônimo]
    A2 --> A5[Acessa formulário de nova ocorrência]
    A3 --> A5
    A4 --> A5
    A5 --> A6[Seleciona categoria entre as 6 opções]
    A6 --> A7[Informa localização específica na escola]
    A7 --> A8[Escreve descrição detalhada da situação]
    A8 --> A9[Sistema anexa data e hora automaticamente]
    A9 --> A10{Todos os campos obrigatórios estão preenchidos?}
    A10 -->|Não| A11[Sistema destaca os campos pendentes]
    A11 --> A6
    A10 -->|Sim| A12[Usuário revisa o resumo da ocorrência]
    A12 --> A13{Confirma o envio?}
    A13 -->|Não, quer editar| A6
    A13 -->|Sim| A14[Sistema gera protocolo/ID da ocorrência]
    A14 --> A15["Status inicial: Recebida"]
    A15 --> A16[Sistema notifica a administração]
    A16 --> A17[Administração abre a ocorrência]
    A17 --> A18["Status atualizado: Em análise"]
    A18 --> A19{Informações são suficientes?}
    A19 -->|Não| A20[Registra observação pedindo mais detalhes]
    A20 --> A18
    A19 -->|Sim| A21{Ocorrência procede?}
    A21 -->|Não| A22[Registra justificativa]
    A22 --> A23["Status: Arquivada"]
    A21 -->|Sim| A24[Define responsável e ação a tomar]
    A24 --> A25["Status: Em providência"]
    A25 --> A26[Responsável executa a ação]
    A26 --> A27{Ação resolveu o problema?}
    A27 -->|Não| A28[Registra novo ajuste/providência]
    A28 --> A26
    A27 -->|Sim| A29[Registra descrição da resolução]
    A29 --> A30["Status: Resolvida"]
    A23 --> A31[Sistema notifica encerramento]
    A30 --> A31
    A31 --> A32[Fim]
```

### Explicação passo a passo

**Fase 1 — Acesso e identificação (A0 a A4)**
1. **A0 — Início:** o usuário entra no sistema (site ou app).
2. **A1 — Verificação de cadastro:** o sistema pergunta se o usuário já tem cadastro, pois só faz sentido pedir login/cadastro para quem vai se identificar.
3. **A2 — Cadastro rápido:** caminho de quem quer se identificar e ainda não tem conta — coleta apenas o essencial (nome, e-mail, perfil: aluno/professor/funcionário).
4. **A3 — Login:** caminho de quem já tem cadastro e quer se identificar.
5. **A4 — Anônimo:** caminho de quem prefere não se identificar; pula direto para o formulário, sem coletar nenhum dado pessoal (regra RN08).

**Fase 2 — Preenchimento e validação (A5 a A11)**
6. **A5 — Formulário de ocorrência:** ponto de encontro dos três caminhos anteriores; todos chegam ao mesmo formulário.
7. **A6 — Categoria:** o usuário escolhe uma das 6 categorias definidas (Estrutura, Segurança, Limpeza, Equipamentos, Situações inadequadas, Outros).
8. **A7 — Localização:** especifica onde o problema ocorre (ex.: "Bloco B, sala 12").
9. **A8 — Descrição:** campo de texto livre para detalhar a situação.
10. **A9 — Data automática:** o sistema registra o momento do relato sem intervenção do usuário (regra RN03).
11. **A10 — Validação:** o sistema confere se categoria, localização e descrição foram preenchidos.
12. **A11 — Correção:** se algo estiver faltando, o sistema aponta os campos pendentes e devolve o usuário à etapa A6, sem apagar o que já foi digitado.

**Fase 3 — Revisão e envio (A12 a A16)**
13. **A12 — Revisão:** antes de enviar, o usuário vê um resumo de tudo o que preencheu.
14. **A13 — Confirmação:** o usuário decide se envia ou volta para editar algo.
15. **A14 — Protocolo:** ao confirmar, o sistema gera um número/ID único para a ocorrência, usado depois para consulta e acompanhamento.
16. **A15 — Status "Recebida":** o registro entra oficialmente no sistema.
17. **A16 — Notificação:** a administração é avisada de que há uma nova ocorrência para analisar.

**Fase 4 — Análise administrativa (A17 a A23)**
18. **A17 — Abertura:** a administração acessa a ocorrência na área administrativa.
19. **A18 — Status "Em análise":** o status muda assim que alguém começa a avaliar o caso.
20. **A19 — Checagem de completude:** a administração avalia se as informações bastam para decidir o que fazer.
21. **A20 — Pedido de mais detalhes:** se faltar contexto, isso fica registrado como observação (o caso permanece "Em análise" — não retorna ao usuário automaticamente, pois pode ser anônimo).
22. **A21 — Procedência:** decisão central: a situação relatada é real e cabe à escola resolver?
23. **A22/A23 — Arquivamento:** se não procede, a administração justifica e o status muda para "Arquivada".

**Fase 5 — Providência e resolução (A24 a A32)**
24. **A24 — Definição de ação:** se procede, define-se quem é o responsável e o que será feito.
25. **A25 — Status "Em providência":** marca que uma ação está em andamento.
26. **A26 — Execução:** o responsável realmente executa a ação combinada.
27. **A27 — Verificação de resultado:** avalia-se se o problema foi de fato solucionado.
28. **A28 — Novo ajuste:** se não foi suficiente, registra-se uma nova providência e o ciclo A26-A27 se repete (é o "loop de acompanhamento" também visto no diagrama de estados).
29. **A29/A30 — Resolução:** quando o problema é resolvido, a solução é descrita e o status muda para "Resolvida".
30. **A31/A32 — Encerramento:** tanto ocorrências arquivadas quanto resolvidas geram uma notificação final de encerramento, e o processo termina.

---

## 2. Modelo de Banco de Dados (Diagrama ER)

```mermaid
erDiagram
    USUARIO ||--o{ OCORRENCIA : registra
    CATEGORIA ||--o{ OCORRENCIA : classifica
    OCORRENCIA ||--o{ PROVIDENCIA : recebe
    OCORRENCIA ||--o{ STATUS_HISTORICO : possui
    ADMINISTRADOR ||--o{ PROVIDENCIA : executa

    USUARIO {
        int id_usuario PK
        string nome
        string email
        string perfil
        boolean anonimo
    }

    OCORRENCIA {
        int id_ocorrencia PK
        int id_usuario FK
        int id_categoria FK
        string localizacao
        string descricao
        date data_registro
        string status
        boolean relato_anonimo
    }

    CATEGORIA {
        int id_categoria PK
        string nome
        string descricao
    }

    PROVIDENCIA {
        int id_providencia PK
        int id_ocorrencia FK
        int id_administrador FK
        string descricao
        date data_providencia
    }

    ADMINISTRADOR {
        int id_administrador PK
        string nome
        string cargo
        string email
    }

    STATUS_HISTORICO {
        int id_historico PK
        int id_ocorrencia FK
        string status_anterior
        string status_novo
        date data_alteracao
    }
```

### Descrição das entidades

- **USUARIO** — armazena os dados de quem registra a ocorrência (quando identificado); o campo `anonimo` indica se o usuário optou por não se identificar.
- **OCORRENCIA** — entidade central; guarda categoria, localização, descrição, data, status atual e se o relato foi anônimo.
- **CATEGORIA** — lista as categorias possíveis (Estrutura, Segurança, Limpeza, Equipamentos, Situações inadequadas, Outros).
- **PROVIDENCIA** — registra cada ação tomada pela administração para tratar uma ocorrência; uma ocorrência pode ter várias providências.
- **ADMINISTRADOR** — responsável por analisar ocorrências e registrar providências.
- **STATUS_HISTORICO** — mantém o histórico de mudanças de status de cada ocorrência, permitindo rastrear todo o andamento (Recebida → Em análise → Em providência → Resolvida/Arquivada).

### Relacionamentos

- Um **usuário** pode registrar **várias ocorrências** (1:N).
- Uma **categoria** pode classificar **várias ocorrências** (1:N).
- Uma **ocorrência** pode ter **várias providências** (1:N).
- Uma **ocorrência** pode ter **vários registros no histórico de status** (1:N).
- Um **administrador** pode executar **várias providências** (1:N).

---

## 3. Diagrama de Sequência (Interação entre Usuário, Sistema e Administração)

Enquanto o fluxograma mostra o *processo* como um todo, o diagrama de sequência mostra *quem troca mensagens com quem* e em que ordem, deixando mais claro o papel de cada participante (Usuário, Sistema e Administração) durante o ciclo de vida de uma ocorrência.

```mermaid
sequenceDiagram
    actor U as Usuário
    participant S as Sistema
    actor Adm as Administração

    U->>S: Acessa o sistema
    U->>S: Escolhe relato (identificado/anônimo)
    U->>S: Preenche categoria, localização e descrição
    S->>S: Valida dados obrigatórios
    alt Dados inválidos
        S-->>U: Solicita correção
        U->>S: Reenvia dados corrigidos
    end
    S->>S: Registra data automaticamente
    S->>Adm: Notifica nova ocorrência (Status: Recebida)
    Adm->>S: Consulta detalhes da ocorrência
    Adm->>S: Registra análise (Status: Em análise)
    alt Ocorrência não procede
        Adm->>S: Registra arquivamento (Status: Arquivada)
        S-->>U: Notifica encerramento
    else Ocorrência procede
        Adm->>S: Define providência (Status: Em providência)
        loop Até resolver
            Adm->>S: Atualiza providência
        end
        Adm->>S: Registra resolução (Status: Resolvida)
        S-->>U: Notifica resolução da ocorrência
    end
```

**Explicação:** o diagrama deixa explícito que o Usuário só interage diretamente com o Sistema (nunca com a Administração), o que reforça a regra de preservação do anonimato (RN08). A Administração também só enxerga a ocorrência através do Sistema, nunca dados de identificação quando o relato é anônimo. Os blocos `alt` representam decisões (dados inválidos, ocorrência procede ou não) e o bloco `loop` representa o retorno/acompanhamento até a resolução — os mesmos pontos de decisão do fluxograma, agora vistos pela ótica da comunicação entre os atores.

---

## 4. Diagrama de Estados da Ocorrência

Como o status é o elemento central de acompanhamento do sistema, um diagrama de estados ajuda a visualizar exatamente quais transições são permitidas — evitando, por exemplo, que uma ocorrência "pule" de Recebida direto para Resolvida sem passar pela análise.

```mermaid
stateDiagram-v2
    [*] --> Recebida: Ocorrência enviada
    Recebida --> EmAnalise: Administração inicia análise
    EmAnalise --> Arquivada: Ocorrência não procede
    EmAnalise --> EmProvidencia: Ocorrência procede
    EmProvidencia --> EmProvidencia: Nova providência registrada
    EmProvidencia --> Resolvida: Problema solucionado
    Arquivada --> [*]
    Resolvida --> [*]

    Recebida: Recebida
    EmAnalise: Em análise
    EmProvidencia: Em providência
    Arquivada: Arquivada
    Resolvida: Resolvida
```

**Explicação:** cada estado corresponde a um valor possível do campo `status` na entidade OCORRENCIA. As setas mostram as únicas transições válidas: uma ocorrência sempre nasce como **Recebida**, precisa passar por **Em análise** antes de seguir para **Arquivada** ou **Em providência**, e só chega a **Resolvida** depois de pelo menos uma providência registrada. A auto-transição em **Em providência** representa o loop de acompanhamento (podem existir várias providências antes da resolução), e é justamente esse histórico de transições que a entidade STATUS_HISTORICO armazena no banco de dados.

---
