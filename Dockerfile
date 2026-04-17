# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copia manifests e instala dependências (camada cacheável)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copia o restante do código-fonte e compila para produção
COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove a config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os artefatos compilados pelo Angular
# O Angular 19+ gera em dist/<project-name>/browser
COPY --from=builder /app/dist/restataurante-front/browser /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
