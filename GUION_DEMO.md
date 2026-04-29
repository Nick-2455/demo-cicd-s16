# Guion Demo — CI/CD con GitHub Actions + Railway
## Seminario 16

---

## Convenciones

- **[NICK DICE]** — lo que dices en voz alta
- **[MOSTRAR]** — lo que abres o señalas en pantalla
- **[CLAUDE CORRE]** — lo que Claude ejecuta (tú solo dices "siguiente acto")
- **[ESPERAR]** — pausa hasta que el pipeline o deploy terminen

### Tabs abiertas durante toda la demo
| Tab | URL |
|-----|-----|
| 1 | `github.com/Nick-2455/demo-cicd-s16/actions` |
| 2 | PR activo (cambia por acto) |
| 3 | `railway.app` — dashboard del proyecto |
| 4 | `demo-cicd-s16-production.up.railway.app/api/status` |

---

## ACTO 1 — Quitar un endpoint y verlo desaparecer en producción

### Objetivo
Demostrar el ciclo CI → CD completo con un cambio visible y real en producción.

---

**[MOSTRAR]** — abrir en browser: `demo-cicd-s16-production.up.railway.app/api/status`

**[NICK DICE]**
> "Este es nuestro servidor en producción en Railway. El endpoint `/api/status` existe y responde ahora mismo."

---

**[NICK DICE]**
> "Vamos a eliminarlo. En un equipo real esto sería una decisión de arquitectura — limpiar endpoints deprecated. Creo una rama, hago el cambio."

**[CLAUDE CORRE]** — crea rama `feature/remove-status`, elimina el endpoint y su test, hace push, abre PR

---

**[MOSTRAR]** — tab de Actions, el run corriendo en `feature/remove-status`

**[NICK DICE]**
> "CI arrancó automáticamente. Está verificando que el resto de la app sigue funcionando después de remover ese endpoint. Los tests que quedan deben seguir pasando."

**[ESPERAR]** — pipeline verde (~25s)

---

**[MOSTRAR]** — el PR con check verde y botón de merge habilitado

**[NICK DICE]**
> "CI aprobó. El cambio es seguro. Mergeamos a main."

**[CLAUDE CORRE]** — merge del PR

---

**[MOSTRAR]** — Actions, nuevo run en `main` — señalar el grafo

**[NICK DICE]**
> "Aquí empieza CD. El merge a main disparó el pipeline de nuevo. Ven el grafo: primero corren los dos jobs de test en paralelo, y solo si ambos pasan, se desbloquea el job de deploy."

**[ESPERAR]** — run en main verde + Railway redesployando (~1 min)

---

**[MOSTRAR]** — Railway dashboard, deployment successful

**[NICK DICE]**
> "Railway detectó el nuevo commit en main y redesplegó automáticamente. Sin que yo tocara nada en el servidor."

**[MOSTRAR]** — browser: `demo-cicd-s16-production.up.railway.app/api/status`

**[NICK DICE]**
> "El endpoint ya no existe en producción. Lo que mergeamos a main es exactamente lo que está corriendo en el servidor. Eso es Continuous Deployment."

---

## ACTO 2 — Nuevo endpoint con bug: CI falla, CD nunca se activa

### Objetivo
Demostrar que CI bloquea el merge y que CD nunca corre si los tests fallan.

---

**[NICK DICE]**
> "Ahora agrego un endpoint nuevo, `/api/eco`, que repite el mensaje que le mandes. Pero voy a cometer un error en el código — el tipo de error que pasa cuando trabajas rápido."

**[CLAUDE CORRE]** — crea rama `feature/endpoint-eco`, agrega el endpoint con un bug (nombre de campo incorrecto en el código), escribe el test correcto, hace push, abre PR

---

**[MOSTRAR]** — Actions, pipeline corriendo en `feature/endpoint-eco`

**[NICK DICE]**
> "CI está corriendo. El test valida que el endpoint retorne el campo `eco` con el mensaje, pero en el código cometí un error en el nombre del campo."

**[ESPERAR]** — pipeline rojo (~20s)

---

**[MOSTRAR]** — el run rojo, abrir el log del step "Ejecutar tests"

**[NICK DICE]**
> "CI detectó el bug. El test esperaba `eco` pero el código retornó `mensaje`. Fallen en segundos antes de llegar a ningún servidor."

**[MOSTRAR]** — el PR con check rojo y botón de merge deshabilitado

**[NICK DICE]**
> "GitHub bloqueó el merge automáticamente. Pero lo más importante — regresen a Actions."

**[MOSTRAR]** — Actions, señalar que el job `Build & Deploy` no corrió

**[NICK DICE]**
> "El job de deploy ni siquiera se ejecutó. Como `test` falló, el pipeline se detuvo. CD es imposible sin CI. El servidor de Railway no fue tocado. Producción está intacta."

---

## ACTO 3 — Fix correcto: CI pasa, CD despliega, endpoint vivo en producción

### Objetivo
Cerrar el ciclo completo: fix → CI verde → merge → CD → endpoint visible en el browser.

---

**[NICK DICE]**
> "El dev lee el log, entiende el error, corrige el nombre del campo en el código y sube el fix al mismo PR."

**[CLAUDE CORRE]** — corrige el bug en el código, hace push a la misma rama

---

**[MOSTRAR]** — Actions, nuevo run corriendo en `feature/endpoint-eco`

**[NICK DICE]**
> "CI está corriendo el fix. Mismo proceso — mismo pipeline — pero ahora el código es correcto."

**[ESPERAR]** — pipeline verde (~25s)

---

**[MOSTRAR]** — PR con check verde, botón de merge habilitado

**[NICK DICE]**
> "CI aprobó el fix. Ahora sí podemos mergear con confianza."

**[CLAUDE CORRE]** — merge del PR

---

**[MOSTRAR]** — Actions, run en main — señalar el grafo `test → deploy`

**[NICK DICE]**
> "De nuevo el ciclo completo: tests en paralelo, ambos pasan, job de deploy se activa. Esta vez sí."

**[ESPERAR]** — run en main verde + Railway redesplegando

---

**[MOSTRAR]** — Railway: Deployment successful

**[MOSTRAR]** — browser: `demo-cicd-s16-production.up.railway.app/api/eco?msg=hola`

**[NICK DICE]**
> "El endpoint está vivo en producción. Responde con `{ eco: 'hola' }`. El código que escribimos hace 2 minutos ya está corriendo en un servidor real, validado, sin intervención manual."

---

## Pregunta frecuente: ¿por qué el merge no es automático?

**Si el profe o alguien pregunta:** *"¿No debería estar todo automatizado?"*

**[NICK DICE]**
> "El merge es manual intencionalmente — es el code review. Nadie quiere que cualquier push llegue a producción sin que alguien lo revise. Lo que sí está 100% automatizado es todo lo que pasa antes y después: CI corre solo en cada push, y CD se dispara solo después del merge."

```
push → CI automático → merge manual (code review) → CI + CD automático → Railway despliega
```

> "Si quisieras cero intervención humana existe trunk-based development: push directo a main sin PR. Pero requiere mucha confianza en los tests y es menos común en equipos."

---

## Cierre

**[MOSTRAR]** — vista general de Actions con todos los runs

**[NICK DICE]**
> "Este es el historial completo de la demo:
> — Acto 1: cambio limpio → CI verde → CD despliega → producción actualizada.
> — Acto 2: bug → CI rojo → merge bloqueado → CD nunca corre → producción intacta.
> — Acto 3: fix → CI verde → CD despliega → endpoint nuevo en producción.
>
> Eso es CI/CD: una red de seguridad automatizada que protege producción y elimina el deploy manual."

---

## Reset para volver a correr la demo

Dile a Claude: **"resetea"**

Limpia todas las ramas `feature/*` y `hotfix/*` y cierra los PRs abiertos.
La app en Railway queda en el estado post-demo (sin `/api/status`, con `/api/eco`).
