# Afiliados — El Market de Botanic

Autoridad técnica y de negocio del **catálogo afiliado** como motor para lanzar
**El Market de Botanic** antes que el modelo de tiendas/profesionales. Contexto
de producto en [monetizacion.md](monetizacion.md) y [PRODUCT.md](../../PRODUCT.md);
definición funcional del módulo en [../app/botanic-market.md](../app/botanic-market.md).

## Propósito

El Market de Botanic (fase 3 en [PLAN.md](../../PLAN.md)) tenía como vía de
entrada las tiendas/profesionales. Los programas de afiliados permiten
**adelantar el lanzamiento** con un catálogo de productos reales de jardinería
(plantas y relacionados) sin stock, sin logística, sin pagos integrados y con
coste 0: Botanic recomienda, el proveedor vende y paga comisión.

Con esto El Market nace como **catálogo afiliado curado** y, con el tiempo,
puede convivir con el modelo B2B de tiendas (monetizacion.md).

## Programas investigados (ES, plantas y relacionados)

| Proveedor | Vía de acceso | Comisión | Cookie | Notas para automatización |
|---|---|---|---|---|
| **Amazon Afiliados** | directo (`afiliados.amazon.es`) | ~3% (Lawn & Garden, Home, Home Improvement, Pets) | 24 h | Catálogo gigante; **PA-API v5** permite búsqueda de productos, precio e imagen por ASIN. 3% tier tras los recortes de 2020/2026 |
| **ManoMano** | **Awin** (exclusivo) | hasta 7% | 10 días | Marketplace líder DIY+jardín en Europa (~16M productos). Feeds de producto automáticos, deeplinks, calendario de ofertas |
| **Leroy Merlin ES** | **Awin** (exclusivo) | 6% marca propia / 3% marketplace | 30 días post-click | ~180.000 referencias online, best sellers para afiliados, catálogo actualizado. Desde jul 2025 presupuesto limitado en productos marketplace: priorizar marca propia |
| **Be.Green** | Adpump + directo (`hello@be.green`) | hasta 13% | 90 días | E-commerce de plantas líder ES/IT/FR. Widgets/scripts embebibles, links y banners |
| **ViveroPlantas** | directo | s/n (manual) | s/n | Aprobación manual, orientado a blogs/creadores. Revisión de calidad del perfil |
| **Viveros Criado** | directo | 5% | 78 h | Plugin WooCommerce; requiere WordPress para publicar catálogo fácilmente |
| **Sybotanica** | directo | comisión mensual | s/n | Enfoque marca/audiencia amante de plantas |
| **SMPLY PLANTS** | directo (ambassador) | 10% + 15% desc. followers | s/n | Código de afiliado con descuento al usuario |
| **Plantaflor** | directo | 5% | s/n | Vivero de interior/exterior y floristería |
| **Avalon Magic Plants** | Daisycon | 10,5% | s/n | Semillas/cactus/hierbas — revisar encaje de marca (etnobotánica) |

### Redes agregadoras

Una cuenta, acceso a muchos programas y **feeds de producto estandarizados**
(clave para la automatización):

| Red | Relevancia | Notas |
|---|---|---|
| **Awin** | **Clave** | Leroy Merlin ES y ManoMano son exclusivos de Awin. Feeds de producto, deeplinks, API de transacciones |
| **TradeTracker** | Alta | Muchos anunciantes ES, feeds y API |
| **Admitad** | Media | Be.Green presente; programa España |
| **Adpump** | Media | Be.Green, ManoMano |
| **Daisycon** | Media | Avalon, semillas/natural |
| **Impact** | Baja-media | Grandes marcas; menos específico de jardín |

**Estrategia de red**: empezar con **Awin** (cubre los 2 grandes: Leroy y
ManoMano) + **Amazon Afiliados** en paralelo. El resto son long tail para
cuando el Market tenga tráfico.

## Niveles de implementación

### Nivel 1 — Manual / curado (validación, coste 0)

- Selección a mano de ~50-150 productos representativos por categoría.
- Enlaces de afiliado estáticos (con `tag` de Amazon / deeplink Awin).
- Tabla `affiliate_products` con datos curados (precio, imagen, descripción ES).
- Ideal para el **wireframe y el primer despliegue**: valida que el usuario
  quiere "comprar producto nuevo" dentro de Botanic sin invertir en pipeline.

**Esfuerzo**: días. **Herramientas**: solo código + curaduría humana/agente.

### Nivel 2 — Semiautomática (agéntica)

- **Feeds de producto** importados periódicamente (CSV/JSON de Awin, Amazon PA-API).
- Un **agente IA** hace la curaduría sobre cada lote nuevo:
  - mapea la categoría externa → taxonomía Botanic (`affiliate_category_map`);
  - filtra por relevancia a plantas/jardín y por calidad de datos;
  - reescribe/afina descripciones en ES;
  - detecta incumplimientos de política (faltan `rel="nofollow"`, marca en PPC, etc.);
  - marca productos para revisión humana cuando hay duda.
- El agente **propone** y el humano **aprueba** antes de publicar.

**Esfuerzo**: semanas. **Herramientas**: importador + agente + tabla de
pendientes de revisión.

### Nivel 3 — Automática

- Sincronización programada: **cron** (GitHub Actions o Edge Function + `pg_cron`)
  refresca precios, stock y alta de productos nuevos desde PA-API Awin.
- **Proxy de clicks** `/out` en la app: registra el click (tabla `affiliate_clicks`,
  RLS) y redirige 302 al enlace de afiliado. Permite analítica propia sin depender
  solo del dashboard del proveedor.
- Reglas automáticas de baja (producto caído, fuera de stock, comisión 0).
- Curaduría agéntica en *background* con cola de aprobación para casos límite.

**Esfuerzo**: meses. **Herramientas**: pipeline de sync + proxy de clicks +
cola de aprobación agéntica.

## Taxonomía de categorías del Market

Reutiliza y amplía el espíritu de las 8 categorías P2P
(`semillas, esquejes, plantas, tiestos, accesorios, herramientas, libros, otros`)
con foco en catálogo de producto nuevo:

| Slug | Nombre | Ejemplos |
|---|---|---|
| `plantas` | Plantas | interior, exterior, suculentas, aromáticas |
| `semillas` | Semillas y bulbos | semillas, bulbos, esquejes envasados |
| `tiestos` | Tiestos y macetas | macetas, jardineras, autorriego |
| `sustratos` | Sustratos y abonos | tierra, abonos, fertilizantes |
| `riego` | Riego | regaderas, mangueras, sistemas goteo |
| `herramientas` | Herramientas | tijeras, palas, guantes |
| `iluminacion` | Iluminación | luces de cultivo, grow lights |
| `decoracion` | Decoración | estanterías, terrarios, arte vegetal |
| `libros` | Libros y guías | guías de cultivo y cuidado |
| `invernaderos` | Invernaderos | mini-invernaderos, protecciones |
| `plagas` | Control de plagas | insecticidas, trampas |
| `mobiliario` | Mobiliario de jardín | mesas, bancos, parasoles |

## Schema DB propuesto (con RLS desde día 1)

```sql
-- Proveedores de afiliación
CREATE TABLE public.affiliate_providers (
  id           TEXT PRIMARY KEY,           -- 'amazon' | 'awin_leroy' | 'awin_manomano' | ...
  name         TEXT NOT NULL,
  network      TEXT,                       -- 'amazon' | 'awin' | 'tradetracker' | ...
  commission_rate NUMERIC(5,2),            -- % de comisión (para informar)
  cookie_days  INT,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Producto afiliado del catálogo del Market
CREATE TABLE public.affiliate_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   TEXT NOT NULL REFERENCES public.affiliate_providers(id),
  external_id   TEXT NOT NULL,             -- ASIN (amazon) / id del feed (awin)
  category_slug TEXT NOT NULL,             -- taxonomía de arriba
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2),
  currency      TEXT NOT NULL DEFAULT 'EUR',
  image_url     TEXT,
  affiliate_url TEXT NOT NULL,
  rating        NUMERIC(2,1),
  status        TEXT NOT NULL DEFAULT 'active',  -- active | pending_review | inactive
  last_synced_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_id, external_id)
);
CREATE INDEX idx_affiliate_products_category ON public.affiliate_products(category_slug, status);
CREATE INDEX idx_affiliate_products_provider ON public.affiliate_products(provider_id);

-- Mapeo de categorías externas → taxonomía Botanic
CREATE TABLE public.affiliate_category_map (
  provider_id      TEXT NOT NULL REFERENCES public.affiliate_providers(id),
  external_slug    TEXT NOT NULL,
  botanic_slug     TEXT NOT NULL,
  PRIMARY KEY (provider_id, external_slug)
);

-- Clicks a través del proxy /out
CREATE TABLE public.affiliate_clicks (
  id         BIGSERIAL PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id),   -- null para anónimos
  referrer   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_affiliate_clicks_product ON public.affiliate_clicks(product_id, created_at DESC);
CREATE INDEX idx_affiliate_clicks_user ON public.affiliate_clicks(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;
```

**RLS** (regla del módulo DB: toda tabla nueva lleva RLS desde el commit que la
crea):

```sql
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "affiliate_products_select" ON public.affiliate_products
  FOR SELECT USING (status = 'active');
-- INSERT/UPDATE/DELETE: solo service_role / migración / importador

ALTER TABLE public.affiliate_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "affiliate_providers_select" ON public.affiliate_providers
  FOR SELECT USING (active = true);

ALTER TABLE public.affiliate_category_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "affiliate_category_map_select" ON public.affiliate_category_map
  FOR SELECT USING (true);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "affiliate_clicks_insert" ON public.affiliate_clicks
  FOR INSERT WITH CHECK (true);                       -- tracking sin auth
-- sin SELECT para clientes: el admin lee desde el dashboard / service_role
```

## Constraints

- **Coste objetivo 0 €**: programas gratis de entrada (Amazon, Awin) y todo el
  pipeline en el stack existente (bun, Supabase Free, GitHub Actions). Los
  widgets de Be.Green son opcionales y externos.
- **`rel="nofollow"` obligatorio** en todos los enlaces de afiliado (política
  Amazon y SEO). Los deeplinks de Awin ya lo gestionan, pero verificar en el
  proxy `/out`.
- **No pujar por marca** en PPC (Leroy exige negativizar marca; política común).
- **RLS desde día 1** en todas las tablas nuevas.
- **Límites Supabase Free** (500 MB DB, 1 GB storage, 5 GB egress): los feeds
  de producto no se cachean como blobs grandes en DB; se guarda solo el
  catálogo normalizado y la imagen se referencia por URL.
- **Coherencia de marca**: el catálogo afiliado no debe parecer spam publicitario.
  Copy y UX según [DESIGN.md](../../DESIGN.md) y la voz de [PRODUCT.md](../../PRODUCT.md)
  (recomendación curada, no grid infinito de banners).
- **Riesgo comisiones**: Amazon redujo Lawn & Garden a ~3% (2020/2026) y los
  feed-operators reportan EPC bajos; la rentabilidad viene del volumen de
  tráfico curado, no de comisiones altas. Be.Green (13%) y ManoMano (7%) son
  mejores márgenes por transacción.

## Pendientes / roadmap

- [ ] Verificar estado actual de los programas en Awin (alta de cuenta y de los
  programas Leroy Merlin ES y ManoMano ES).
- [ ] Solicitar cuenta Amazon Afiliados + credenciales PA-API v5 (requiere 3
  ventas en 180 días para activar la API).
- [ ] Wireframe: mock de catálogo afiliado en `/app/market/*` (placeholder hoy).
- [ ] Migración del schema propuesto (con RLS) cuando se valide el enfoque.
- [ ] Importador de feeds (Awin CSV) + curaduría agéntica (Nivel 2).
- [ ] Proxy de clicks `/out` + analítica propia (Nivel 3).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).