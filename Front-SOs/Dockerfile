FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Adiciona o Vite (e outros binários) ao PATH
ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 5173

# Executa o Vite permitindo acesso externo
CMD ["npm", "run", "dev", "--", "--host"]
