# Guion — Explicación del Workflow YAML
## Antes de la demo en vivo

Abrir `.github/workflows/ci-cd.yml` en GitHub mientras explicas.
Señalar cada bloque con el cursor mientras hablas.

---

## 1. El nombre y el trigger

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```

**[NICK DICE]**
> "Este archivo es el corazón del pipeline. Se llama workflow y vive dentro del repo en `.github/workflows/`.
>
> La sección `on` define cuándo se activa. En este caso se dispara en dos situaciones: cuando alguien hace push a `main` o `develop`, y cuando se abre o actualiza un Pull Request hacia `main`.
>
> Es decir — cualquier cambio de código relevante dispara el pipeline automáticamente. Sin que nadie tenga que hacer nada."

---

## 2. Job 1 — CI: Lint & Test

```yaml
jobs:
  test:
    name: Lint & Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
```

**[NICK DICE]**
> "El pipeline tiene dos jobs. El primero se llama `test` y corre en `ubuntu-latest` — una VM que GitHub levanta gratis para nosotros cada vez que se dispara el pipeline.
>
> La parte interesante es `matrix`. Esto le dice a GitHub Actions que corra el mismo job dos veces en paralelo: una vez con Node 18 y otra con Node 20. Si tu código funciona en una versión pero no en otra, CI lo detecta."

---

## 3. Los steps del job de CI

```yaml
    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Ejecutar tests
        run: npm test
        env:
          NODE_ENV: test
```

**[NICK DICE]**
> "Cada job tiene steps — pasos que se ejecutan en orden.
>
> Primero `checkout`: descarga el código del repo a la VM.
>
> Luego `setup-node`: instala la versión de Node que toca según la matrix. El `cache: npm` guarda las dependencias entre runs para que sea más rápido.
>
> Después `npm ci`: instala las dependencias exactas del `package-lock.json`. Más estricto que `npm install` — garantiza reproducibilidad.
>
> Finalmente `npm test`: corre los tests. Si alguno falla, el step retorna un error, el job falla, y GitHub bloquea el merge."

---

## 4. Job 2 — CD: Build & Deploy

```yaml
  deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
```

**[NICK DICE]**
> "El segundo job es el de CD. Tiene dos condiciones clave.
>
> `needs: test` — solo corre si el job de test pasó. Si CI falla, este job ni se intenta. No hay forma de desplegar código roto.
>
> `if: github.ref == 'refs/heads/main'` — solo se activa cuando el código está en la rama `main`. En un PR esta condición es falsa, así que el deploy se salta. CD solo ocurre después del merge."

---

## 5. Los steps del job de CD

```yaml
    steps:
      - name: Instalar dependencias (producción)
        run: npm ci --omit=dev

      - name: Build artefacto
        run: |
          mkdir -p dist
          cp -r src dist/
          cp package.json dist/
          echo "Build completado: $(date)" > dist/build-info.txt
          echo "Commit: ${{ github.sha }}" >> dist/build-info.txt

      - name: Simular deploy
        run: |
          echo "Desplegando versión ${{ github.sha }} a producción..."
          echo "Deploy exitoso"
```

**[NICK DICE]**
> "El job de deploy instala solo las dependencias de producción — sin las de desarrollo ni testing.
>
> Luego construye el artefacto: empaqueta el código en una carpeta `dist` y genera un archivo con la fecha y el hash del commit. En un proyecto real aquí construirías una imagen Docker o un bundle.
>
> El último step es el deploy. En este caso es simulado — imprime el hash del commit que se está desplegando. En producción real esto sería un comando a Railway, AWS, o el servidor que uses.
>
> Nota el `${{ github.sha }}` — eso es una variable de contexto de GitHub Actions. Siempre sabe exactamente qué commit está corriendo."

---

## Resumen visual para cerrar la explicación

Señalar el diagrama en Actions cuando haya un run verde:

```
[Lint & Test 18.x] ──┐
                      ├──→ [Build & Deploy] ✓  (solo en main)
[Lint & Test 20.x] ──┘
```

**[NICK DICE]**
> "En resumen: dos jobs de test en paralelo para ser más rápidos, y un job de deploy que solo corre si ambos pasan y solo en main. Todo definido en un archivo YAML de 50 líneas que vive junto al código.
>
> Ahora lo vemos en acción."

→ Pasar a la demo.
