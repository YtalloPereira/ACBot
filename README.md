# 🎓🤖 ACBot

O projeto **ACBot** foi desenvolvido como parte das sprints 9 e 10 do programa de bolsas Compass UOL para formação em machine learning na AWS e tem como objetivo criar um chatbot educacional utilizando o **Amazon Lex** e outras tecnologias da AWS para fornecer informações sobre processos academicos do Instituto Federal de Educação, Ciência e Tecnologia da Paraíba.

## 📖 Índice

- [📝 Descrição do Projeto](#-acbot)
- [🏛️ Arquitetura](#️-arquitetura)
- [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🔎 Sobre o Chatbot](#-sobre-o-chatbot)
  - [Descrição do projeto](#descrição-do-projeto)
  - [Justificativa](#justificativa)
- [🚀 Execução e Utilização](#-execução-e-utilização)
  - [Pré-requisitos](#pré-requisitos)
  - [Passos de inicialização](#passos-de-inicialização)
  - [Passos para executar as funções com o Serverless no API Gateway e Lambda](#passos-para-executar-as-funções-com-o-serverless-no-api-gateway-e-lambda)
  - [Passos para executar o chatbot no Lex e o backend no Lambda](#passos-para-executar-o-chatbot-no-lex-e-o-backend-no-lambda)
- [🧱 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚧 Desafios e Soluções](#-desafios-e-soluções)
- [🌐 Acesso ao Chatbot](#-acesso-ao-chatbot)
- [👥 Contribuidores](#-contribuidores)


## 🏛️ Principais Funcionalidades

- **Integração com Lex:** Um chatbot que se comunica com o usuário, processando textos e mensagens.
- **Reconhecimento de imagens:** Utiliza o Amazon Rekognition para validação de documentos.
- **Conversão de texto para áudio:** Com o Amazon Polly, o bot gera áudio a partir de respostas textuais.
- **Consulta de processos acadêmicos:** Integração com DynamoDB para armazenar e consultar tipos de processos acadêmicos.


## 🏛️ Arquitetura

### Visão Geral
O sistema será composto pelos seguintes componentes principais:
- **Amazon Lex:** Para gerenciamento das interações e compreensão de texto.
- **Amazon Polly:** Para conversão de texto em fala, facilitando o acesso para alunos com deficiência visual ou preferências auditivas.
- **Amazon S3:** Para armazenamento seguro de documentos enviados pelos alunos.
- **AWS Lambda:** Para gerenciamento da lógica do bot, integrando diferentes serviços e processos.
- **Amazon Rekognition:** Para análise de imagens, reconhecimento facial e verificação de documentos enviados.
- **Amazon Bedrock:** Para fornecer respostas avançadas e personalizadas utilizando IA generativa.
- **Amazon Transcribe:** Para transcrição de mensagens de voz enviadas pelos usuários, ampliando a acessibilidade.
- **Amazon DynamoDB:** Para armazenamento de dados estruturados relacionados a processos acadêmicos e interações do bot.

### Detalhamento dos Componentes
- **Frontend:** Interface onde os alunos interagem com o bot, podendo ser web ou mobile. Esta interface deve ser responsiva e intuitiva, facilitando a navegação e o uso.
- **Backend:** AWS Lambda gerencia a lógica do bot, coordenando chamadas aos serviços como Amazon Lex, Rekognition, e Bedrock, processando dados e executando funções conforme necessário.
- **Armazenamento:** Amazon S3 garante o armazenamento seguro dos documentos, com políticas de acesso configuradas para proteger dados sensíveis.
- **Processamento de Linguagem Natural:** Amazon Lex para processamento de linguagem natural, ajudando o bot a entender e responder a consultas textuais. Amazon Bedrock complementa essa capacidade, oferecendo respostas avançadas baseadas em contexto e aprendizado de máquina.
- **Reconhecimento de Imagens e Análise de Documentos:** Amazon Rekognition é utilizado para análise de imagens enviadas, como fotos de documentos, para verificação de identidade e extração de informações.
- **Transcrição de Voz:** Amazon Transcribe converte mensagens de voz enviadas pelos usuários em texto, ampliando as formas de interação.
- **Notificações:** Serviços de notificação para envio de e-mails ou mensagens sobre o status dos processos, assegurando que os alunos sejam informados de qualquer atualização relevante.
###

<p align="center">
  <img src="./assets/ACBot-architecture.jpg" alt="Diagrama de Arquitetura">
</p>

###
***

O diagrama mostra como o usuário interage com a interface de chat, que envia solicitações para o Amazon Lex. O Amazon Lex processa essas solicitações, chama funções Lambda para manipulação de dados, verifica identidades usando o Amazon Rekognition, armazena documentos no Amazon S3, e utiliza o Amazon Bedrock para fornecer respostas avançadas. Finalmente, o Amazon Polly pode ser utilizado para converter texto em fala, criando uma resposta mais interativa para o usuário.


## ⚙️ Tecnologias Utilizadas

1. **[Lex](https://aws.amazon.com/lex/)** - *Interface de conversa do bot, que permite interações naturais com os usuários.*
2. **[Polly](https://aws.amazon.com/polly/)** - *Conversão de texto para fala, proporcionando uma experiência de voz ao usuário.*
3. **[Lambda](https://aws.amazon.com/lambda)** - *Backend do chatbot e integração dos serviços, permitindo execução de código em resposta a eventos.*
4. **[DynamoDB](https://aws.amazon.com/dynamodb/)** - *Banco de dados NoSQL para armazenar dados do chatbot, garantindo alta escalabilidade e desempenho.*
5. **[API Gateway](https://aws.amazon.com/api-gateway)** - *Exposição de funções Lambda via endpoints API, facilitando a comunicação entre o frontend e o backend.*
6. **[Cognito](https://aws.amazon.com/cognito/)** - *Serviço de autenticação e controle de acesso, assegurando que apenas usuários autorizados possam interagir com o bot.*
7. **[Serverless Framework](https://www.serverless.com/)** - *Facilita a construção e implementação de aplicações serverless, simplificando a gestão de recursos na nuvem.*
8. **[React](https://reactjs.org)** - *Biblioteca JavaScript para construir interfaces de usuário, proporcionando uma experiência interativa e responsiva.*
9. **[Axios](https://axios-http.com/)** - *Biblioteca para realizar requisições HTTP, facilitando a comunicação com APIs externas.*
10. **[S3](https://aws.amazon.com/s3)** - *Armazenamento de arquivos de áudio e logs, oferecendo uma solução escalável para armazenar dados.*
11. **[Rekognition](https://aws.amazon.com/rekognition/)** - *Serviço de análise de imagem e vídeo, que pode ser utilizado para melhorar a interação do bot.*
12. **[Bedrock](https://aws.amazon.com/bedrock/)** - *Plataforma de modelos generativos de IA, proporcionando recursos avançados de inteligência artificial.*
13. **[Amplify](https://aws.amazon.com/amplify/)** - *Plataforma para desenvolvimento e hospedagem de aplicativos web e mobile, facilitando o gerenciamento de recursos AWS.*
14. **[Git](https://git-scm.com)** - *Controle de versão do projeto, garantindo rastreamento e gerenciamento de alterações.*
15. **[Trello](https://trello.com)** - *Gerenciamento das tarefas do projeto, organizando o fluxo de trabalho da equipe.*
16. **[AWS CLI](https://aws.amazon.com/cli/)** - *Interface de linha de comando para gerenciar serviços AWS, facilitando a automação de tarefas.*

## 🔎 Sobre o Chatbot

### Descrição do projeto
O projeto consiste em um bot de assistência para processos acadêmicos, desenvolvido para alunos do IFPB, com o objetivo de simplificar e otimizar o gerenciamento de processos acadêmicos. Ele proporciona orientação sobre procedimentos e análise de documentos, utilizando tecnologias avançadas de inteligência artificial para oferecer um suporte eficiente e prático nas seguintes áreas:

### Justificativa
A importância deste projeto reside na simplificação dos processos acadêmicos, melhorando a eficiência e a experiência do usuário. O bot visa reduzir a carga administrativa tanto para os alunos quanto para o corpo administrativo. Com a utilização de tecnologias como reconhecimento de imagem e IA generativa, o bot pode oferecer respostas mais personalizadas e seguras, garantindo que todas as etapas sejam executadas corretamente.

## 🤖 Intents do Chatbot

### 1. **WelcomeIntent**
   - **Descrição:** Saudação inicial e orientações ao usuário sobre como o bot pode ajudar.
   - **Exemplos de frases:**
     - "Olá"
     - "Oi"
     - "Bom dia"
     - "Quais informações posso obter?"

### 2. **ProcessOpeningGuideIntent**
   - **Descrição:** Fornece orientação sobre como abrir um processo.
   - **Exemplos de frases:**
     - "Como posso abrir um processo acadêmico?"
     - "Quais são os passos para iniciar um processo de revisão de nota?"

### 3. **ListAllProcessTypesIntent**
   - **Descrição:** Lista todos os tipos de processos acadêmicos disponíveis no IFPB, fornecendo uma visão geral de cada um.
   - **Exemplos de frases:**
     - "Quais são os tipos de processos acadêmicos disponíveis?"
     - "Quais são os processos acadêmicos que a instituição oferece?"

### 4. **CheckProcessTypesIntent**
   - **Descrição:** Consulta um processo acadêmico específico.
   - **Exemplos de frases:**
     - "Quero consultar um processo acadêmico."
     - "Quero informações detalhadas sobre um processo acadêmico."

### 5. **ProcessOutcomeIntent**
   - **Descrição:** Verifica a situação e efeitos dos requerimentos.
   - **Exemplos de frases:**
     - "**********"

### 6. **CheckReadabilityIntent**
   - **Descrição:** Verifica a legibilidade de documentos dos processos.
   - **Exemplos de frases:**
     - "******?"

### 7. **FallbackIntent**
   - **Descrição:** Acionada quando o bot não compreende a solicitação do usuário.

## 🚀 Execução e Utilização

### Pré-requisitos

### Passos de inicialização

### Passos para executar as funções com o Serverless no API Gateway e Lambda

### Passos para executar o chatbot no Lex e o backend no Lambda


## 🧱 Estrutura do projeto


```
├── api
│   ├── controllers
│   ├── lib
│   │   ├── .env.example
│   │   ├── index.js
│   ├── serverless.yml
├── assets
├── bot
├── server
│   ├── database
│   ├── lambda
│   │   ├── controllers
│   │   ├── lib
│   │   ├── utils
│   │   ├── index.js
│   ├── node_modules
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
├── web
├── .gitignore
└── README.md
```

### Descrição das principais pastas

- **`api/`**: Controladores das rotas e configuração do Serverless para o deploy de funções Lambda.
- **`assets/`**: Armazena recursos estáticos.
- **`server/`**: Contém a lógica do backend, incluindo funções Lambda e scripts de manipulação de banco de dados.
- **`database/`**: Contém dados em JSON e scripts de migração/seeder para o DynamoDB.
- **`lambda/`**: Funções Lambda que processam as requisições do bot e realizam a integração com os serviços da AWS.
- **`utils/`**: Funções utilitárias que suportam o projeto, como a geração de áudio e consulta de dados.
- **`web/`**: Diretório reservado para a aplicação web (frontend e backend).
- **`.env.example`**: Exemplo de configuração de variáveis de ambiente.
- **`.gitignore`**: Arquivo que especifica quais arquivos ou pastas devem ser ignorados pelo Git.
- **`README.md`**: Arquivo de documentação principal do projeto.


## 🚧 Desafios e Soluções



## 🌐 Acesso ao Chatbot

O ACBot está disponível em: [acbot.com.br](https://)

## 👥 Contribuidores

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/43382153?v=4" width=115><br><sub>Richard Freitas</sub>](https://github.com/wesleyfreit) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/91287544?v=4" width=115><br><sub>João Emmanuel</sub>](https://github.com/KBSSA1) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/92949630?v=4" width=115><br><sub>Geraldo Mendes</sub>](https://github.com/Geraldomendes) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/113937488?v=4" width=115><br><sub>Ytallo Pereira</sub>](https://github.com/YtalloPereira) 
| :---: | :---: | :---: | :---: |

***

  
---






