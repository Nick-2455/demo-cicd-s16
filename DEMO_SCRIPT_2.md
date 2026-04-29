# Demo Script 2 — Seminario 16 CI/CD
## Escenario: Hotfix de emergencia + Deploy automático

Muestra el flujo completo: CI atrapa un bug en el PR, el dev lo corrige,
y al hacer merge a main el pipeline dispara CD automáticamente.

---

## Setup (antes de presentar)

```bash
git checkout main && git pull
```

Tener abiertas estas tabs en el navegador:
- GitHub Actions (vista general de workflows)
- PR #3 (`feature/validar-nombre`) — ya existe, verde
- PR #4 (`hotfix/health-format`) — ya existe, rojo → verde

---

## Acto 1 — CI: PR limpio pasa los checks

> "Tenemos un PR con un feature nuevo. CI lo validó automáticamente."

Mostrar PR #3 en GitHub → checks verdes → botón de merge habilitado.

> "Sin tocar nada manualmente, GitHub Actions corrió los tests en Node 18 y 20.
> El equipo puede mergear con confianza."

Hacer merge del PR #3 desde GitHub (botón **Merge pull request**).

Ir a Actions → mostrar que se disparó un nuevo run en `main` con **dos jobs en secuencia**:
```
[Lint & Test (18.x)]  ──┐
                         ├──→  [Build & Deploy]
[Lint & Test (20.x)]  ──┘
```

> "Al mergear a main, CI corrió de nuevo y luego CD se disparó automáticamente.
> Eso es Continuous Delivery: cada merge a main produce un artefacto listo para producción."

---

## Acto 2 — CI: PR con bug es bloqueado

> "Ahora llega un hotfix apresurado. El dev cambió un campo de la API sin correr tests."

Mostrar PR #4 → primer commit → checks **rojos** → botón de merge deshabilitado.

> "CI detectó la regresión en 17 segundos. GitHub bloquea el merge automáticamente.
> Sin esto, ese cambio hubiera roto a todos los clientes que leen el campo `status`."

---

## Acto 3 — CI: fix correcto, checks vuelven a verde

> "El dev revisa el test que falló, entiende el contrato de la API, y hace el fix correcto."

Mostrar PR #4 → segundo commit → checks **verdes** → botón de merge habilitado.

> "El pipeline nos forzó a hacer el fix bien, no solo rápido."

---

## Acto 4 — CD: merge a main dispara el deploy automático

> "Ahora mergeamos el hotfix a main. Observen qué pasa en Actions."

Hacer merge del PR #4 desde GitHub (botón **Merge pull request**).

Ir a Actions inmediatamente → mostrar el nuevo run disparándose en `main`:

1. Jobs de `test` corren en paralelo (18.x y 20.x)
2. Ambos pasan → job `deploy` se desbloquea y corre
3. El log del deploy muestra:
   ```
   Desplegando versión <sha> a producción...
   Deploy exitoso
   ```

> "Esto es CI/CD completo:
> - CI validó que el código es correcto
> - CD empaquetó y desplegó automáticamente al pasar los checks
> - Nadie tuvo que hacer nada manualmente después del merge"

---

## Resumen visual para cerrar

Mostrar la vista de Actions con todos los runs:

| Run | Rama | Resultado |
|-----|------|-----------|
| PR #3 | feature/validar-nombre | Verde (CI) |
| merge a main | main | Verde — CI + **CD** |
| PR #4 bug | hotfix/health-format | Rojo (CI bloqueó) |
| PR #4 fix | hotfix/health-format | Verde (CI) |
| merge a main | main | Verde — CI + **CD** |

> "Cada merge a main produjo un deploy. Cada PR fue validado antes de llegar a main.
> Eso es lo que hace CI/CD por un equipo."
