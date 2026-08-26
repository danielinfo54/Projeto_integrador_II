# Fluxograma do Sistema

## Sistema de Denúncias e Ocorrências Escolares

Este fluxograma representa o fluxo inicial de registro, análise e acompanhamento das ocorrências escolares.

```mermaid
flowchart TD
    A([Início]) --> B[Usuário acessa o sistema]
    B --> C[Registrar ocorrência]
    C --> D{Deseja se identificar?}
    D -->|Sim| E[Identificar usuário]
    D -->|Não| F[Relato anônimo]
    E --> G[Selecionar categoria]
    F --> G
    G --> H[Informar localização]
    H --> I[Descrever ocorrência]
    I --> J[Registrar data]
    J --> K[Enviar ocorrência]
    K --> L[Ocorrência recebida]
    L --> M[Administração consulta a ocorrência]
    M --> N[Em análise]
    N --> O{Necessita providências?}
    O -->|Sim| P[Registrar providências]
    O -->|Não| Q[Registrar resolução]
    P --> R{Ocorrência resolvida?}
    R -->|Sim| Q[Registrar resolução]
    R -->|Não| S[Ocorrência não concluída]
    Q --> T([Fim])
    S --> T
