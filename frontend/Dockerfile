# Escolha a imagem oficial do Node.js
FROM node:16 as build

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package.json package-lock.json /app/

# Instale as dependências
RUN npm ci

# Copie o restante do código para o contêiner
COPY . /app

# Execute o comando para compilar o projeto React
RUN npm run build

# Use uma imagem base para o servidor web (nginx)
FROM nginx:alpine

# Copie o build do React para a pasta do servidor web
COPY --from=build /app/build /usr/share/nginx/html

# Exponha a porta do servidor web
EXPOSE 80
