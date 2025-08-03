# Ste CRUD API

Uma API RESTful desenvolvida em NestJS para gerenciamento de pessoas, com sistema de autenticação JWT e documentação automática.

## Visão Geral

Esta aplicação fornece endpoints para operações CRUD (Create, Read, Update, Delete) de pessoas, incluindo sistema de autenticação e autorização. A API é construída com TypeScript, utiliza PostgreSQL como banco de dados e inclui documentação automática via Swagger.

## Tecnologias Utilizadas

- **Backend**: NestJS (Node.js framework)
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Documentação**: Swagger/OpenAPI
- **Deploy**: Railway
- **Validação**: class-validator
- **Criptografia**: bcryptjs

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18+
- PostgreSQL ou um container docker com PostgreSQL
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**

```bash
git clone <repository-url>
cd ste-crud
```

A URL pode ser pega no botão verde "<> code" mais acima

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados**

   Certifique-se de que o PostgreSQL está rodando, que tenha um banco chamado postgres(ou outro nome se você configurar no .env) e que nele não tenha nenhum dado importante, pois eles podem ser perdidos.

4. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações, um exemplo:

```
# Configuração do Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=sua-senha

# Configuração do JWT
JWT_SECRET=sua-chave-secreta-muito-segura

# Configuração da Aplicação
PORT=4001
NODE_ENV=development
```

**Explicação das variáveis:**

- `DATABASE_URL`: URL completa de conexão com PostgreSQL (formato: postgresql://usuario:senha@host:porta/banco)
- `DATABASE_HOST`: Host do banco de dados (padrão: localhost)
- `DATABASE_PORT`: Porta do banco de dados (padrão: 5432)
- `DATABASE_NAME`: Nome do banco de dados (padrão: postgres)
- `DATABASE_USER`: Usuário do banco de dados (padrão: postgres)
- `DATABASE_PASSWORD`: Senha do banco de dados
- `JWT_SECRET`: Chave secreta para assinar tokens JWT (deve ser uma string longa e segura)
- `PORT`: Porta onde a aplicação irá rodar (padrão: 4001)
- `NODE_ENV`: Ambiente de execução (development/production)

5. **Execute as migrações e seeds**

```bash
npm run seed
```

Isso irá criar dados falsos para popular as tabelas e também é criado dois usuários padrões

6. **Inicie a aplicação**

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:4001`

## Documentação da API

A documentação interativa está disponível em:

- **Local**: http://localhost:4001/api

## Usuários de Teste

- **Admin**: admin@example.com / admin123
- **Usuário**: user@example.com / user123

## Scripts Disponíveis

- `npm run start`: Inicia a aplicação em produção
- `npm run start:dev`: Inicia em modo desenvolvimento
- `npm run build`: Compila o projeto
- `npm run seed`: Executa os seeds do banco
- `npm run test`: Executa os testes
