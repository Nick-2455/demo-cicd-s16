# Guion Demo — Seminario 16 CI/CD
## Instrucciones de uso

- **[NICK DICE]** — lo que dices en voz alta al profe
- **[MOSTRAR]** — lo que abres/señalas en pantalla
- **[CLAUDE]** — lo que Claude corre (tú solo dices "siguiente acto")
- **[ESPERAR]** — pausa hasta que el pipeline termine

Tabs abiertas durante toda la demo:
1. GitHub Actions — `github.com/Nick-2455/demo-cicd-s16/actions`
2. PR abierto (cambia por acto)
3. Railway — `railway.app`
4. App en producción — `demo-cicd-s16-production.up.railway.app`

---

## ACTO 1 — Feature nueva, pipeline verde

**[NICK DICE]**
> "Voy a agregar un endpoint nuevo a la API. En equipos reales esto lo haría un compañero en su propia rama."

**[CLAUDE]** — crea rama `feature/endpoint-X`, agrega endpoint + test, abre PR

**[MOSTRAR]** — cambiar a tab de GitHub Actions

**[NICK DICE]**
> "Automáticamente, sin que yo haga nada, GitHub Actions levantó una VM y está corriendo los tests en Node 18 y 20 en paralelo. Esto es CI — Integración Continua."

**[ESPERAR]** — pipeline verde (~25s)

**[MOSTRAR]** — el grafo: `[Lint & Test 18x] + [Lint & Test 20x] → [Build & Deploy (skipped)]`

**[NICK DICE]**
> "Los dos jobs de test pasaron. El job de deploy está skipped porque esto es un PR, no un merge a main. CD solo se activa cuando el código ya fue aprobado y mergeado."

**[MOSTRAR]** — el PR en GitHub, botón de merge habilitado

**[NICK DICE]**
> "GitHub habilitó el merge porque CI pasó. Si hubiera fallado, este botón estaría bloqueado."

**[CLAUDE]** — hace merge del PR

**[MOSTRAR]** — Actions, nuevo run en main con deploy + Railway redesployando

**[NICK DICE]**
> "Al mergear a main se dispararon CI y CD juntos. Railway está detectando el nuevo commit y redesplegando automáticamente. Eso es CD — Continuous Deployment."

**[ESPERAR]** — Railway termina el deploy

**[MOSTRAR]** — `demo-cicd-s16-production.up.railway.app` con el nuevo endpoint visible

---

## ACTO 2 — Bug que CI atrapa, merge bloqueado

**[NICK DICE]**
> "Ahora simulo algo que pasa mucho en equipos reales: alguien sube un cambio apresurado sin correr los tests localmente."

**[CLAUDE]** — crea rama `hotfix/X`, introduce bug en el código, abre PR

**[MOSTRAR]** — Actions corriendo el nuevo pipeline

**[NICK DICE]**
> "CI está corriendo. El test espera un valor específico pero el código tiene un error. En segundos vamos a saber si hay problema."

**[ESPERAR]** — pipeline rojo (~20s)

**[MOSTRAR]** — run rojo, abrir el log del test fallido

**[NICK DICE]**
> "CI detectó el bug. Ahora miren el PR."

**[MOSTRAR]** — el PR con el check rojo y el botón de merge deshabilitado

**[NICK DICE]**
> "GitHub bloqueó el merge automáticamente. Este código no puede llegar a main ni a producción mientras el check esté rojo. Sin CI, este bug hubiera llegado directo a los usuarios."

---

## ACTO 3 — Fix correcto, pipeline verde, deploy a producción

**[NICK DICE]**
> "El dev revisa el log, encuentra el error, lo corrige y sube el fix."

**[CLAUDE]** — corrige el bug, hace push al mismo PR

**[MOSTRAR]** — Actions, nuevo run corriendo en la misma rama

**[ESPERAR]** — pipeline verde

**[MOSTRAR]** — PR con check verde, botón de merge habilitado

**[NICK DICE]**
> "CI confirmó que el fix es correcto. Ahora sí podemos mergear."

**[CLAUDE]** — hace merge del PR

**[MOSTRAR]** — Actions, run en main con CI + CD completo + Railway redesplegando

**[NICK DICE]**
> "CI corrió de nuevo en main, pasó, y CD desplegó automáticamente a producción. Todo sin intervención manual. Eso es un pipeline de CI/CD completo funcionando en tiempo real."

**[MOSTRAR]** — Railway deployment successful + la app en producción funcionando

---

## Para cerrar

**[NICK DICE]**
> "Resumiendo: cada PR fue validado por CI antes de poder mergearse. Cada merge a main disparó un deploy automático a Railway. El historial de Actions es auditoría completa de qué pasó, cuándo, y si pasó o no."

**[MOSTRAR]** — vista general de Actions con todos los runs verde/rojo/verde
