# OMB-140-Merkle

Fork de trabajo de **OpenMausBot v0.1.140** (Merkle.Space) — bitácora de modificaciones
que aplicamos sobre el original. Base: tag upstream `v0.1.140` (commit `4b74b80`).

Rama base: **`base-v0.1.140`** = v0.1.140 original sin parches.

## Lista v140/A/B/C/D

### A — Parches que aplicamos a la 140
| Código | Qué es | Origen (en la 130) | Estado |
|---|---|---|---|
| v140-A1 | Reponer `openssh-client` + `docker.io` en la imagen runtime (el escritorio del VPS se maneja por Docker-over-SSH) | 0011 | APLICADO (001) |
| v140-A2 | Ningún bot muestra su rol junto al nombre | A2 (0021) | PENDIENTE |
| v140-A3 | Formato markdown en los mensajes del USUARIO | A3 (0020) | PENDIENTE |
| v140-A4 | Narración interna: fondo transparente, 2 px menor, padding vertical a la mitad | A4 (0017/0030) | PENDIENTE |
| v140-A5 | Burbujas del usuario con texto largo sin recorte | A5 (0022) | PENDIENTE |
| v140-A6 | Tema Atelier: burbuja del usuario blanca, igual que la del bot | A6 (0023) | PENDIENTE |
| v140-A7 | Cuadro "This run" conserva el colapso (llave global, sobrevive recargas) | A7 (0032) | PENDIENTE |
| v140-A8 | Búsqueda dentro de las tablas siempre | A8 (0020) | PENDIENTE |
| v140-A9 | Bloque de superficie (prompt del harness) compacto | A15 (0037) | PENDIENTE |

### B — Pendientes técnicos
| Código | Qué es | Estado |
|---|---|---|
| v140-B1 | Escritorio del VPS: construir/etiquetar la imagen de escritorio `cua-local-vm:driver-0.37.0-v8` (la 140 pide la capa v8; en el host solo hay v5/v6) | EN CURSO |
| v140-B2 | App iOS: por qué los hilos se despliegan distinto tras 107→130 | PENDIENTE |
| v140-B3 | Procedimiento alfa → producción (incremental vs de un jalón) | PENDIENTE |

### C — Ya ejecutadas
| Código | Qué es |
|---|---|
| v140-C1 | Fork `pepeneif/OMB-140-Merkle` creado + rama `base-v0.1.140` (v0.1.140 limpio) |
| v140-C2 | v0.1.140 desplegada en alfa (`alfa.merkle.space`) sobre un clon del dataset de producción |

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
  no se crea, actualiza ni ve.

## No reciclable tal cual desde la 130
Los parches que tocan la UI o el compositor (A1, A2, A8, A9, A10, A11, A13, A14, A15 y 0020–0037)
chocan porque la UI de la 140 cambió. Se rehacen sobre la 140.
