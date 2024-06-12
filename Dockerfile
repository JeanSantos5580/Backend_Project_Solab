# Define a imagem base
FROM node:16-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Instala o PM2 globalmente
RUN npm install

RUN npm install -g prisma

RUN npm install -g pm2

# Expõe a porta que o servidor do Nest.js está ouvindo
EXPOSE 3001

# Define o comando para iniciar o servidor do Nest.js com o PM2
CMD ["npm", "run", "dev"]
