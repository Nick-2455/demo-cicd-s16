# Demo Script — Seminario 16 CI/CD

Tres actos. Cada uno tiene los comandos exactos para copiar-pegar en terminal.
Mantén GitHub Actions abierto en el navegador para que el público vea el pipeline correr en tiempo real.

---

## Acto 1 — Pipeline verde (feature normal)

> "Voy a agregar un endpoint nuevo. Creo una rama, hago el cambio, lo subo."

```bash
git checkout -b feature/endpoint-adios
```

Editar `src/index.js` — agregar este bloque antes del `if (process.env...)`:

```js
app.get('/api/adios', (req, res) => {
  const nombre = req.query.nombre || 'Mundo';
  res.json({ mensaje: `Adios, ${nombre}!` });
});
```

Agregar el test correspondiente en `tests/index.test.js`:

```js
  test('GET /api/adios responde correctamente', async () => {
    const res = await request(app).get('/api/adios?nombre=CI');
    expect(res.body.mensaje).toBe('Adios, CI!');
  });
```

```bash
git add .
git commit -m "feat: agregar endpoint /api/adios"
git push -u origin feature/endpoint-adios
```

Abrir PR en GitHub → el pipeline corre → **verde** → merge.

---

## Acto 2 — Pipeline rojo (bug que CI atrapa)

> "Alguien del equipo empuja un cambio con un error. CI lo atrapa antes de llegar a main."

```bash
git checkout -b feature/bug-demo
```

Editar `src/index.js` — romper el endpoint `/api/saludo`:

```js
// Cambiar esta línea:
res.json({ mensaje: `Hola, ${nombre}!` });

// Por esta (bug intencional — mayúscula en "hola"):
res.json({ mensaje: `hola, ${nombre}!` });
```

```bash
git add .
git commit -m "fix: cambiar saludo (con bug intencional)"
git push -u origin feature/bug-demo
```

Abrir PR en GitHub → el pipeline corre → **rojo** → el test `'Hola, Docker!'` falla → GitHub bloquea el merge.

> "Ven que no se puede hacer merge mientras el check esté rojo. CI actúa como red de seguridad."

---

## Acto 3 — Fix y pipeline verde de nuevo

> "Identificamos el bug, lo corregimos, y el pipeline nos da luz verde."

```bash
# Seguir en la misma rama feature/bug-demo
```

Editar `src/index.js` — revertir el bug:

```js
// Volver a:
res.json({ mensaje: `Hola, ${nombre}!` });
```

```bash
git add .
git commit -m "fix: corregir mayúscula en saludo"
git push
```

El pipeline corre de nuevo → **verde** → PR listo para merge.

> "El pipeline nos confirmó que el fix es correcto. Ahora sí podemos mergear con confianza."

---

## Puntos clave para mencionar durante la demo

- Cada push dispara el workflow automáticamente (mostrar el trigger en el YAML)
- Los tests corren en Node 18 y 20 en paralelo (matrix strategy)
- El job `deploy` solo corre si `test` pasa — mostrar el grafo de dependencias
- GitHub bloquea el merge mientras haya un check rojo (mostrar el botón gris en el PR)
- Todo queda registrado: quién hizo qué, cuándo, y si pasó o no
