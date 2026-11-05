# OMB-140-Merkle

Fork de trabajo de **OpenMausBot v0.1.140** (Merkle.Space) — bitácora de modificaciones
que aplicamos sobre el original. Base: tag upstream `v0.1.140` (commit `4b74b80`).

Rama base: **`base-v0.1.140`** = v0.1.140 original sin parches.

## Lista v140/A/B/C/D

### A — Parches que aplicamos a la 140
| Código | Qué es | Origen (en la 130) | Estado |
|---|---|---|---|
| v140-A1 | Reponer `openssh-client` + `docker.io` en la imagen runtime (el escritorio del VPS se maneja por Docker-over-SSH) | 0011 | APLICADO (001) + desplegado en alfa |
| v140-A2 | Ningún bot muestra su rol junto al nombre | A2 (0021) | PENDIENTE |
| v140-A3 | Formato markdown en los mensajes del USUARIO | A3 (0020) | PENDIENTE |
| v140-A4 | Narración interna: fondo transparente, 2 px menor, padding vertical a la mitad | A4 (0017/0030) | PENDIENTE |
| v140-A5 | Burbujas del usuario con texto largo sin recorte | A5 (0022) | PENDIENTE |
| v140-A6 | Tema Atelier: burbuja del usuario blanca, igual que la del bot | A6 (0023) | PENDIENTE |
| v140-A7 | Cuadro "This run" conserva el colapso (llave global, sobrevive recargas) | A7 (0032) | PENDIENTE |
| v140-A8 | Búsqueda dentro de las tablas siempre | A8 (0020) | PENDIENTE |
| v140-A9 | Bloque de superficie (prompt del harness) compacto | A15 (0037) | APLICADO (ef840d27f) + desplegado en alfa |

### B — Pendientes técnicos
| Código | Qué es | Estado |
|---|---|---|
| v140-B1 | Escritorio del VPS: construir/etiquetar la imagen de escritorio `cua-local-vm:driver-0.37.0-v8` (la 140 pide la capa v8; en el host solo hay v5/v6) | HECHO (imagen `59bff5bd748e`, capa 8) |
| v140-B2 | App iOS: por qué los hilos se despliegan distinto tras 107→130 | PENDIENTE |
| v140-B3 | Procedimiento alfa → producción (incremental vs de un jalón) | PENDIENTE |

### C — Ya ejecutadas
| Código | Qué es |
|---|---|
| v140-C1 | Fork `pepeneif/OMB-140-Merkle` creado + rama `base-v0.1.140` (v0.1.140 limpio) |
| v140-C2 | v0.1.140 desplegada en alfa (`alfa.merkle.space`) sobre un clon del dataset de producción |
| v140-C3 | Imagen `openmausbot:v0.1.140` reconstruida con el parche 001 y recreada en alfa (healthy) |

### D — Compactación / tamaño de datos
| Código | Qué es | Estado |
|---|---|---|
| v140-D1 | Compactación manual en la PWA | PENDIENTE |
| v140-D2 | `threads.eventLogMaxBytes` + `eventLogRetentionDays` | PENDIENTE |
| v140-D3 | Recortables fuera de `.openmausbot` | PENDIENTE |
| v140-D4 | `memory-journal` → wiki y podar | PENDIENTE |

## Bitácora de parches
- **001** (v140-A1): Dockerfile — repone `openssh-client` y `docker.io` en el paso apt del runtime,
  igual que la 130. Sin ellos OMB no alcanza el daemon Docker del VPS por SSH y el escritorio del bot
  no se crea, actualiza ni ve. Verificado en alfa: `ssh`/`docker` presentes y el daemon responde por SSH.
- **Imagen de escritorio v8** (v140-B1): construida con el Dockerfile que genera el propio OMB
  (`server/container-computer.ts` → `managedImageDockerfile`), base `trycua/xfce-cua@sha256:274eb6…`.
  Queda etiquetada `localhost/openmausbot/cua-local-vm:driver-0.37.0-v8` (`59bff5bd748e`), que es la
  referencia que la 140 espera (`IMAGE_LAYER_VERSION = "8"`).

- **v140-G (2026-11-04)**: dos ajustes de la ronda de alfa, commit `2a9b765b1`.
  (1) **Rail colapsado (modo simple, iconos)**: los dos grupos que Jose vio separados quedan **2px mas
  juntos que en la 130**. En la 130 el tope (Search + New) y la columna de botones usan `gap-1` (4px) y el
  pie `gap-0.5` (2px); en la 140 quedan **2px** arriba y **0** en el pie (`gap-0`), es decir 2px menos en
  ambos. Afecta `Sidebar.tsx` (data-sidebar-top-row y data-sidebar-top-buttons) y `SidebarFooter.tsx` +
  `SidebarFooterNav.tsx` (nav de tools y apilado del pie). Pruebas dirigidas actualizadas.
  (2) **Modo simple: la pastilla del bot** pasa del centro de la barra superior a la **derecha, junto al
  icono de Bot's screen**. En `ChatView.tsx` la fila de la cabecera usa `justify-end` en modo simple y la
  identidad deja de ser columna central (`col-start-2`/`justify-self-center` solo en modo avanzado). Prueba
  nueva en `ChatView.controls.test.ts`.

## No reciclable tal cual desde la 130
Los parches que tocan la UI o el compositor (A1, A2, A8, A9, A10, A11, A13, A14, A15 y 0020–0037)
chocan porque la UI de la 140 cambió. Se rehacen sobre la 140.

### Bitácora de parches (cont.)
- **v140-B (2026-11-04)**: cuatro ajustes de UI pedidos por Jose sobre el build de alfa —
  (1) la pastilla del nombre iguala el alto (36px) de la de hilos; (2) las respuestas finales con formato
  recuperan el fondo de tarjeta (`bg-card`) que el upstream quitó en `e00a082e3`; (3) Atelier con
  "Color my messages" ya no deja el texto blanco sobre blanco (tokens de tinta oscura dentro de la
  burbuja blanca); (4) el desplegable de hilos se porta idéntico al de la 130. Commit `8e4c339fa`.

- **v140-C (2026-11-04)**: dos puntos de la ronda de alfa.
  (1) *This run* recupera el colapso **global y durable** de la 130: una sola preferencia (misma en
  todos los hilos) en `localStorage` (llave `omb-run-card-collapsed`) que sobrevive recargas; se
  reabre solo con el clic. Se copió `src/lib/run-open-state.ts` de la 130 (+ su prueba) y se quitó la
  `storeKey` por hilo de `VerifyCard.tsx`/`ChatView.tsx`. Commit `2bd8f5c48`.
  (2) El selector de hilos no plegaba las corridas de automatización porque el **clon de datos** de
  alfa había perdido la marca `routineRunId` en 49 tareas y le faltaban 44 hilos (incluido
  "Automatizaciones · Log"); no era el código (el selector es idéntico al de la 130). Se **re-clonó**
  el volumen `omb_140_data` desde `omb_prod_data` (15.2G, beta en solo-lectura), se borró el lease del
  clon y se deshabilitaron las 9 rutinas activas en alfa para no duplicar informes. Resultado:
  193 tareas, 89 con marca, hilo Log presente y sobrevive al arranque.

- **v140-E (2026-11-04)**: seis ajustes de UI de la ronda de alfa. Commit `6a53606a6`.
  (1) La pastilla del nombre del bot (arriba a la derecha) lleva más aire a la izquierda: `pl-1.5` → `pl-3`
  (era el punto donde el nombre quedaba pegado al borde). (2) Los avatares del rail/lista encogen ~10%:
  36→32, 44→40, 32→29. (3) Automations y Triggers se separan como en la 130: Automations pasa al icono de
  calendario (`CalendarDays`, `scope: "schedules"`) y Triggers al rayo (`Zap`, `scope: "triggers"`); se
  porta `scope` a `routinesFocus` (store) y el filtro/título a `TriggersPage`, también en la barra del
  teléfono. (4) Team map usa el organigrama (`Network`) y no el de personas, en el footer, el menú de cuenta
  y la barra del teléfono. (5) Los iconos de arriba y abajo del rail se acercan ~10%
  (`gap-2`→`gap-[7px]`, `gap-1`→`gap-[3.5px]`). (6) A20: elegir el modelo o la intensidad en el menú ⋯ abre
  el **selector de modelos del chat** como en la 130 (no los ajustes): se monta un `ModelPicker` oculto en la
  cabecera avanzada más un store de petición (`src/lib/model-picker-open.ts`) que lo abre; si no hay selector
  montado para el hilo, cae a los ajustes. Pruebas dirigidas en verde (salvo 2 fallos preexistentes del
  badge de motor en `Sidebar.simple-mode.test.ts`, ajenos a este trabajo; se corrigieron aparte 3 expectativas
  obsoletas del menú ⋯ que el propio A18 había dejado atrás).

- **v140-F (2026-11-04)**: refinamientos de la ronda de alfa (modo **avanzado**), commit `88b3ca3fe`.
  (1) La pastilla del nombre del bot (arriba a la derecha) suma otros 2 espacios a la izquierda:
  `pl-3` → `pl-[18px]`. (2) Rail avanzado: los iconos de la parte superior van 3px más cerca del borde
  (`pt-3.5`→`pt-[11px]`) y los de arriba y abajo quedan 1px más juntos entre sí
  (`gap-[3.5px]`→`gap-[3px]` arriba; `gap-1`→`gap-px` en la navegación inferior del pie). (3) **Ancho de la
  columna colapsada**: Avanzada y Simple miden lo mismo (`w-[80px]`→`w-[72px]` en ambas; antes la Avanzada
  era `w-[80px]` y la del rail simple `w-[92px]`), es decir 8px menos que la 130 (`avatarsWidth` 92→72).
  (4) **Formato del texto del usuario**: con markdown activo, un solo `Enter` volvía a pintar una línea en
  blanco de más; se porta el arreglo `0027 (A3 fix)` de la 130 — `.chat-md { white-space: normal }` en
  `src/styles.css`, para que el `<br>` del render no herede el `pre-wrap` de la burbuja (el render emite un
  `\n` literal tras cada `<br>`; con `pre-wrap` se pintaba como segunda línea). Prueba nueva en
  `ChatMarkdown.test.ts`. Pruebas dirigidas **265/265** y `tsc --noEmit` limpio (los 6 fallos de
  `Sidebar.simple-mode.test.ts`/`BotModelBadge.test.ts` son preexistentes, idénticos en HEAD).

- **v140-H (2026-11-05)**: dos puntos de la ronda de alfa. Commit `94b64cf52`.
  (1) **Rail avanzado colapsado**: los cuadros de los iconos se encogen a los tamanos de la 130 — arriba
  (busqueda, actividad, nuevo) y el boton de plegar de `size-[46px]` a **`size-8`** (32px) y el pie
  (automatizaciones, triggers, apps, team map, files, estado del dispositivo) de `size-[46px]`/`size-10`/
  `size-11` a los de la 130: `NavRow` iconsOnly `size-10`, telefono `size-10`, update `size-10`, perfil
  `size-10` (rail) / `size-11`, `ChromeRailToggle` `size-8`. Con los huecos ya 2px menores que la 130, los
  dos grupos quedan de verdad ~2px mas juntos. Toca `Sidebar.tsx`, `SidebarFooterNav.tsx`,
  `SidebarPhoneButton.tsx`, `SidebarProfileMenu.tsx`, `UpdateIndicator.tsx`, `ChromeRailToggle.tsx` y el pie
  de `SidebarFooter.tsx` (`gap-[3px]`→`gap-[2px]`). Pruebas de cabecera del rail actualizadas.
  (2) **Mango de ancho de burbujas (0010) portado a la 140**: se copian `src/lib/bubble-width.ts` y
  `src/components/BubbleResizeHandle.tsx` de la 130; se anade el bloque `.bbl`/`.bbl-handle` a
  `src/styles.css` (unlayered, como en la 130), el mango en `ChatView.tsx` (independiente para tus burbujas,
  las del agente) y en `VerifyCard.tsx` (la tarjeta "This run", con `bbl-run`), y `applyStoredBubbleWidths()`
  en `main.tsx`. Se guarda por dispositivo (localStorage), doble clic restablece, y en tactil se oculta.
  El ancho por defecto de "This run" en la libreria queda en 352px (22rem), su ancho de la hoja en la 140.
  `tsc --noEmit` limpio; pruebas dirigidas en verde (salvo 2 fallos PREEXISTENTES del badge de motor en
  `Sidebar.simple-mode.test.ts` y 1 en `ChatView.conversational.test.ts`, identicos en HEAD limpio).
