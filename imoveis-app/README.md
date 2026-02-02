# Sistema de Gestão de Imóveis

Sistema web para gerenciamento de imóveis para aluguel, desenvolvido com React + TypeScript.

## Funcionalidades

- **Dashboard**: Visão geral de todos os imóveis com estatísticas
- **CRUD de Imóveis**: Adicionar, editar, visualizar e excluir imóveis
- **Controle Financeiro**: Registro de receitas e despesas por imóvel
- **Alertas**: Notificações de contratos vencendo nos próximos 90 dias
- **Responsivo**: Interface adaptada para desktop e dispositivos móveis

## Dados Armazenados

Os dados são salvos no `localStorage` do navegador. Inclui:
- Informações do imóvel (nome, unidade, área, valor)
- Dados financeiros (aluguel, condomínio, IPTU, cotas extras)
- Informações do contrato (inquilino, início, término, vencimento)
- Transações (receitas e despesas)

## Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Navegue até a pasta do projeto
cd imoveis-app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Tecnologias Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## Estrutura do Projeto

```
src/
├── components/
│   ├── AlertsPanel.tsx      # Painel de alertas de contratos
│   ├── Dashboard.tsx        # Tela inicial com estatísticas
│   ├── Header.tsx           # Cabeçalho e navegação
│   ├── PropertyDetails.tsx  # Detalhes do imóvel
│   ├── PropertyForm.tsx     # Formulário de cadastro/edição
│   ├── PropertyList.tsx     # Lista de imóveis
│   └── TransactionForm.tsx  # Formulário de transações
├── types/
│   └── index.ts             # Tipos TypeScript
├── utils/
│   ├── helpers.ts           # Funções utilitárias
│   └── storage.ts           # Funções de localStorage
├── App.tsx                  # Componente principal
├── main.tsx                 # Ponto de entrada
└── index.css                # Estilos globais
```

## Dados Iniciais

O sistema vem pré-carregado com dados de exemplo baseados na planilha Excel:
- LUDCO 1301 - Leila
- AQUARIUS 1305 - Juliete
- AQUARIUS 1103 - Jair
- AQUARIUS 1201 - Nadja
- VITORIA 202 - Vago
- VILAGE ITAP 10 - Vago

## Migração para Banco de Dados

Para migrar os dados do localStorage para um banco de dados:

1. Implemente uma API REST ou GraphQL
2. Substitua as funções em `src/utils/storage.ts` por chamadas à API
3. Os tipos em `src/types/index.ts` já estão prontos para uso com qualquer backend
