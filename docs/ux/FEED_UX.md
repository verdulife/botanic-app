# Botanic — UX del Feed

> **REGLA PARA EL AGENTE — CONTEXTO CONDICIONAL**
>
> Lee este archivo únicamente para tareas relacionadas explícitamente con el feed P2P, presentación de anuncios, módulos del feed, patrones de descubrimiento, prompts de registro dentro del feed o UX/UI específica del feed.

## 1. Feed base

El feed móvil P2P puede utilizar un grid de 2 columnas para las publicaciones.

Conceptualmente:

```text
┌──────────┐ ┌──────────┐
│ Anuncio  │ │ Anuncio  │
├──────────┤ ├──────────┤
│ Anuncio  │ │ Anuncio  │
├──────────┤ ├──────────┤
│ Anuncio  │ │ Anuncio  │
└──────────┘ └──────────┘
```

El grid se interrumpe deliberadamente con módulos horizontales contextuales.

---

## 2. Anatomía del feed

```text
Encabezado
   ↓
Filtrar + Vista
   ↓
Anuncios
   ↓
Módulo contextual
   ↓
Anuncios
   ↓
Módulo contextual
   ↓
Más anuncios
```

El ritmo exacto no está cerrado.

---

## 3. Módulos horizontales

Los módulos horizontales deben romper visualmente la repetición del grid y aportar acciones útiles.

### Descubrimiento

```text
Descubre algo diferente
[ Plantas raras ] [ Plantas fáciles ] [ De temporada ]
```

### Filtro inteligente

```text
Explora por tipo de anuncio
[ En venta ] [ Intercambio ] [ Gratis ]
```

### Registro

```text
¿Te está gustando Botanic?
Crea una cuenta para guardar anuncios y recibir alertas.
[ Crear cuenta ]
```

### Publicación

```text
¿Tienes una planta para regalar?
[ Publicar un anuncio ]
```

### Comunidad

```text
¿Necesitas ayuda con una planta?
[ Explorar Comunidad ]
```

### Ubicación

```text
¿Buscas plantas cerca?
[ Menos de 5 km ] [ Menos de 10 km ] [ Menos de 20 km ]
```

---

## 4. Módulos basados en comportamiento

Posibles contextos:

| Contexto del usuario | Módulo sugerido |
|---|---|
| No hay resultados adecuados | Crear Deseo / alerta |
| Usuario anónimo + navegación repetida | Registro |
| Uso repetido del Mapa | Filtro de distancia |
| Navegación repetida por categoría | Categoría relacionada |
| Exploración por tipos de anuncio | Filtros inteligentes |
| Usuario sin anuncios propios | Sugerencia para publicar |
| Usuario necesita cuidados | Sugerencia de Comunidad |

Estos son patrones UX, no reglas de negocio definitivas.

---

## 5. Registro dentro del feed

El feed puede incluir prompts de registro, pero deben ser:

- contextuales,
- integrados visualmente,
- descartables cuando sea apropiado,
- basados, cuando sea posible, en una interacción demostrada.

Evitar:

```text
Abrir la app
  ↓
Modal de registro inmediato
```

Preferir:

```text
Navegar
  ↓
Interés demostrado
  ↓
Beneficio útil del registro
```

---

## 6. Beneficios útiles del registro

Beneficios relevantes:

- guardar anuncios,
- crear alertas,
- contactar con vendedores,
- publicar anuncios,
- mantener un perfil,
- acceder a conversaciones.

El texto debe comunicar el beneficio en lugar de limitarse a decir:

> "Debes registrarte."

---

## 7. El feed debe favorecer el descubrimiento

El feed no debe sentirse como una base de datos estática.

La variedad puede venir de:

- carruseles horizontales,
- recomendaciones contextuales,
- filtros inteligentes,
- categorías de descubrimiento,
- enlaces a la comunidad,
- sugerencias de cercanía,
- prompts personalizados.

Las publicaciones P2P deben seguir siendo el contenido predominante.

---

## 8. Ritmo visual

Evitar acumular demasiados módulos especiales.

Un módulo debería justificar su posición haciendo al menos una de estas cosas:

```text
Mejorar el descubrimiento
O
Mejorar la navegación
O
Proporcionar un atajo útil
O
Ayudar a la conversión en el momento adecuado
```

Un módulo que no cumpla ninguna de estas funciones no debería insertarse simplemente para romper el grid.

---

## 9. Relación con los modos de vista

Las tres vistas del marketplace representan la **misma tarea de descubrimiento** sobre el **mismo conjunto de datos**:

```text
Búsqueda + Filtros (estado compartido)
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
Lista Mapa Match
```

Cambiar de vista debe conservar el estado actual de búsqueda y filtros. Las tres vistas leen del mismo dataset una vez aplicados los filtros activos; lo que cambia es **cómo** se presentan los resultados, no **qué** resultados son.

Por tanto, el feed (en sentido amplio) es una representación del mismo conjunto de resultados del marketplace, no un universo de datos independiente.

---

## 10. Validación futura

Hay que validar posteriormente:

- con qué frecuencia se encuentran los módulos horizontales,
- si mejoran el descubrimiento o generan distracción,
- si los prompts de registro mejoran la conversión sin perjudicar la exploración,
- qué modo de vista prefieren los usuarios según la tarea,
- si Match genera interacción y descubrimiento útiles.
