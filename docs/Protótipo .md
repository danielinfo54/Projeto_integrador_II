# Arquitetura do Sistema

## Sistema de Denúncias e Ocorrências Escolares

## 1. Visão geral

O Sistema de Denúncias e Ocorrências Escolares tem como objetivo oferecer um canal organizado para que alunos, professores e funcionários comuniquem problemas e situações que necessitam da atenção da administração escolar.

O sistema permitirá o registro de ocorrências de forma identificada ou anônima, possibilitando também o acompanhamento do andamento das providências tomadas pela administração.

---

# 2. Diagrama de Fluxo e Regras de Negócio

## 2.1 Fluxo principal

O processo principal começa com o registro de uma ocorrência pelo usuário. Após o preenchimento das informações, a ocorrência é enviada para análise da administração escolar.

```mermaid
flowchart TD
    A([Início]) --> B[Usuário acessa o sistema]
    B --> C[Registrar ocorrência]

    C --> D{Deseja realizar relato anônimo?}

    D -->|Sim| E[Registrar ocorrência sem identificação]
    D -->|Não| F[Registrar ocorrência identificada]

    E --> G[Selecionar categoria]
    F --> G

    G --> H[Informar localização]
    H --> I[Descrever ocorrência]
    I --> J[Registrar data]
    J --> K[Enviar ocorrência]

    K --> L[Ocorrência recebida]
    L --> M[Administração consulta ocorrência]
    M --> N[Ocorrência em análise]

    N --> O{Necessita providências?}

    O -->|Sim| P[Registrar providências]
    O -->|Não| Q[Registrar resolução]

    P --> R{Ocorrência resolvida?}

    R -->|Sim| Q[Registrar resolução]
    R -->|Não| S[Ocorrência não concluída]

    Q --> T([Fim])
    S --> T



erDiagram

    USUARIO {
        int id_usuario PK
        string nome
        string identificacao
    }

    OCORRENCIA {
        int id_ocorrencia PK
        int id_usuario FK
        int id_categoria FK
        string localizacao
        string descricao
        date data_ocorrencia
        string tipo_relato
        string status
    }

    CATEGORIA {
        int id_categoria PK
        string nome
    }

    PROVIDENCIA {
        int id_providencia PK
        int id_ocorrencia FK
        string descricao
        date data_providencia
    }

    USUARIO ||--o{ OCORRENCIA : "registra"
    CATEGORIA ||--o{ OCORRENCIA : "classifica"
    OCORRENCIA ||--o{ PROVIDENCIA : "possui"
