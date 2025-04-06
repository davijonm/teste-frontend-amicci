# Previsão do Tempo

**https://weather-app-omega-ten-92.vercel.app/**

Este é um projeto de previsão do tempo desenvolvido com **React**, **TypeScript** e **Vite**. Ele permite que os usuários consultem informações climáticas de uma cidade específica ou do local atual utilizando as APIs do Google Maps e OpenWeather.

## Funcionalidades

- Busca de informações climáticas por nome da cidade.
- Determinação automática da localização do usuário e exibição do clima correspondente.
- Exibição de dados como temperatura, clima, umidade e velocidade do vento.
- Layout responsivo e estilizado com **SCSS**.
- Animações CSS para melhorar a experiência do usuário.

## Tecnologias Utilizadas

- **React** com **TypeScript**
- **Vite** para desenvolvimento e build
- **Material-UI** para componentes visuais
- **Google Maps API** para geolocalização e autocomplete
- **OpenWeather API** para dados climáticos
- **SCSS** para estilização
- **Jest** para testes
- **Vercel** Deploy feito na Vercel

## Pré-requisitos

Certifique-se de ter as seguinntes ferramentas instaladas:

- **Node.js** (versão estável mais recente, eu utilizei a 22)
- **npm** ou **yarn** 

Você precisará tmbém das seguintes chaves de API:

1. **Google Maps API Key**: Para geolocalização e autocomplete.
2. **OpenWeather API Key**: Para buscar informações climáticas.

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

1. VITE_GOOGLE_MAPS_API_KEY=sua_google_maps_api_key
2. VITE_OPENWEATHER_API_KEY=sua_openweather_api_key

Substitua `sua_google_maps_api_key` e `sua_openweather_api_key` pelas suas chaves de API. (Você pode usar a sua ou a minha que enviei em um arquivo zip)

## Como Executar o Projeto

1. Clone este repositório:

   ```bash
   git clone https://github.com/davijonm/teste-frontend-amicci.git
   cd teste-frontend-amicci

2. Instale as dependências:

npm install

3. Inicie o servidor de desenvolvimento:

npm run dev

4. Abra o navegador e acesse http://localhost:5173.

## Como executar os testes

npm test

## Estrutura do Projeto

```
src/
├── App.tsx                            # componente principal da aplicação
├── components/                        # componentes
│   └── SearchBar/                     # componente de barra de busca
├── services/                          # serviços para integração com APIs
│   ├── locationService.ts             # serviço para geolocalização
│   └── weatherService.ts              # serviço para dados climáticos
│   └── __tests__/                     # pasta com os testes de serviços
│       └── locationService.test.ts    # testes para o serviço de geolocalização
│       └── weatherService.test.ts     # testes para o serviço de dados climáticos
├── assets/                            # recursos estáticos
├── utils/                             # recursos estáticos
│       └── env.ts                     # env vars globais
├── App.css                            # estilos globais
├── main.tsx                           # ponto de entrada da aplicação
```

## Como Funciona

1. **Busca por Cidade**: O usuário digita o nome da cidade no campo de busca. A aplicação consulta a API OpenWeather e exibe os dados climáticos.
2. **Localização Atual**: O usuário clica no botão "Minha localização". A aplicação utiliza a API de geolocalização do navegador para determinar a localização e consulta as APIs do Google Maps e OpenWeather para exibir os dados climáticos.
3. **Carregamento Inicial**: Ao carregar a página, a aplicação tenta automaticamente buscar o clima com base na localização do usuário.

## Melhorias Futuras

- Implementar cache para reduzir chamadas às APIs.
- Adicionar suporte a múltiplos idiomas.
