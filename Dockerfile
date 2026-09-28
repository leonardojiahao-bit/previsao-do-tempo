FROM nginx:alpine

LABEL org.opencontainers.image.title="Previs茫o do Tempo"
LABEL org.opencontainers.image.description="Aplica莽茫o web de clima com cidades favoritas persistidas no Supabase"
LABEL org.opencontainers.image.source="https://github.com/leonardojiahao-bit/previsao-do-tempo"

COPY index.html style.css config.js favorites.js script.js /usr/share/nginx/html/

EXPOSE 80

