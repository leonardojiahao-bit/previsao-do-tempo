# Previsão do Tempo

## Autor

Leonardo Jiahao Linchen — Matrícula: 22510052

## Descrição

Aplicação web responsiva para consulta do clima por cidade. O projeto apresenta a temperatura atual, a sensação térmica, a umidade, a velocidade do vento e a previsão dos próximos cinco dias.

## API utilizada

O projeto utiliza a [Open-Meteo](https://open-meteo.com/), uma API pública que não exige chave para uso não comercial.

- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
  - Endpoint consumido: `https://geocoding-api.open-meteo.com/v1/search`
  - Uso: localizar uma cidade e obter suas coordenadas geográficas.
- [Open-Meteo Weather API](https://open-meteo.com/en/docs)
  - Endpoint consumido: `https://api.open-meteo.com/v1/forecast`
  - Uso: consultar as condições atuais e a previsão dos próximos cinco dias.

## Funcionalidades

- Pesquisa de cidades.
- Atalhos para consultar cidades brasileiras.
- Consulta da temperatura atual.
- Exibição da sensação térmica.
- Exibição da umidade do ar.
- Exibição da velocidade do vento.
- Previsão dos próximos cinco dias.
- Tratamento de cidade não encontrada e falhas na API.
- Tema claro e tema escuro.
- Layout responsivo para computadores e dispositivos móveis.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Fetch API
- Open-Meteo API
- GitHub Pages

## Como executar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/leonardojiahao-bit/previsao-do-tempo.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd previsao-do-tempo
   ```

3. Abra o arquivo `index.html` no navegador ou utilize a extensão Live Server do Visual Studio Code.

Não é necessário instalar dependências ou configurar uma chave de API.

## Links

- **Aplicação no ar (GitHub Pages):** [https://leonardojiahao-bit.github.io/previsao-do-tempo/](https://leonardojiahao-bit.github.io/previsao-do-tempo/)
- **Repositório:** [https://github.com/leonardojiahao-bit/previsao-do-tempo](https://github.com/leonardojiahao-bit/previsao-do-tempo)
