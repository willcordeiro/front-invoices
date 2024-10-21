# Passos para rodar a aplicação React com Vite e .env

```bash
# 1. Clone o repositório
git clone https://github.com/willcordeiro/front-invoices.git

# 2. Navegue até o diretório do projeto
cd seu-repositorio

# 3. Instale as dependências
npm install
# ou
yarn install

# 4. Crie o arquivo .env com a variável VITE_API_URL
echo "VITE_API_URL=http://localhost:5000/" > .env

# 5. Inicie a aplicação localmente
npm run dev
# ou
yarn dev

# 6. Acesse a aplicação no navegador
# A aplicação estará disponível em:
echo "Abra http://localhost:3000 no seu navegador"

# 6. Acesse a aplicação no online no deploy
echo "Abra https://front-invoices-one.vercel.app/ no seu navegador"


