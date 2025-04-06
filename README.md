# DaPasstWasNicht

## Balsamic

[Public Balsamic Preview](https://balsamiq.cloud/sndtumz/pfnw995)

## MermaidFflowchart

```mermaid
flowchart TD
    A[Startup Screen] -->|If not logged in| B[Register]
    A -->|If logged in| D[Home Screen]

    B -->|Submit registration| F[Login]
    F -->|Login successful| D

    D -->|Report issue| C[Camera]
    C -->|Take photo| E[After Photo]
    E -->|Submit report| G[Send]

    C -->|Back| D
```
