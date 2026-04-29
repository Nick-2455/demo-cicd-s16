# Demo Script 2 — Seminario 16 CI/CD
## Escenario: Hotfix de emergencia en producción

Narrativa más dramática. Hay un bug crítico en `main`, el equipo necesita arreglarlo rápido.
Muestra el valor de CI/CD cuando hay presión: el pipeline te protege incluso cuando tienes prisa.

---

## Setup (antes de presentar)

Asegúrate de estar en main actualizado:

```bash
git checkout main
git pull
```

---

## Acto 1 — El equipo sube un feature nuevo (todo bien)

> "El equipo está trabajando normal. Alguien agrega validación al endpoint de saludo."

```bash
git checkout -b feature/validar-nombre
```

Editar `src/index.js` — agregar validación de longitud:

```js
app.get('/api/saludo', (req, res) => {
  const nombre = req.query.nombre || 'Mundo';
  if (nombre.length > 20) {
    return res.status(400).json({ error: 'Nombre demasiado largo' });
  }
  res.json({ mensaje: `Hola, ${nombre}!` });
});
```

Agregar test en `tests/index.test.js`:

```js
  test('GET /api/saludo rechaza nombres demasiado largos', async () => {
    const res = await request(app).get('/api/saludo?nombre=NombreMuyLargoQueExcedeElLimite');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Nombre demasiado largo');
  });
```

```bash
git add .
git commit -m "feat: validar longitud del nombre en /api/saludo"
git push -u origin feature/validar-nombre
gh pr create --title "feat: validar longitud del nombre" --body "Agrega validación: nombres > 20 caracteres retornan 400."
```

Pipeline → **verde** → merge.

---

## Acto 2 — Alguien hace un hotfix apresurado (y rompe algo)

> "Llega un reporte: el endpoint /health no está retornando el formato correcto.
> Un dev lo 'arregla' rápido sin correr tests localmente. CI lo atrapa."

```bash
git checkout main && git pull
git checkout -b hotfix/health-format
```

Editar `src/index.js` — cambiar el campo `status` por `estado` (rompe el test existente):

```js
app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'OK', timestamp: new Date().toISOString() });
});
```

```bash
git add .
git commit -m "hotfix: cambiar campo status a estado en /health"
git push -u origin hotfix/health-format
gh pr create --title "hotfix: corregir formato /health" --body "Cambio urgente en el campo de respuesta."
```

Pipeline → **rojo** — el test `expect(res.body.status).toBe('OK')` falla.

> "Sin CI, este hotfix habría llegado a producción y roto cualquier cliente que lea el campo `status`."

---

## Acto 3 — Fix correcto: se agrega el campo que faltaba

> "El dev revisa el test, entiende el contrato de la API, y hace el fix correcto."

```bash
# Seguir en la misma rama hotfix/health-format
```

Editar `src/index.js` — mantener ambos campos para no romper clientes existentes:

```js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', estado: 'OK', timestamp: new Date().toISOString() });
});
```

```bash
git add .
git commit -m "hotfix: mantener campo status para compatibilidad"
git push
```

Pipeline → **verde** → PR listo para merge.

> "CI nos forzó a hacer el fix bien, no solo rápido."

---

## Puntos clave para mencionar en este script

- El hotfix apresurado sin tests es el error más común en equipos sin CI
- El pipeline corrió en ~20 segundos y detectó la regresión antes de llegar a producción
- `needs: test` en el job deploy garantiza que nunca se despliega código rojo
- El historial de Actions es auditoría: quién subió qué, cuándo falló, cuándo se corrigió
