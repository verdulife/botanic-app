// Tile provider de OSM por defecto. Único punto a tocar si cambiamos de proveedor.
export const MAP_TILE_URL =
	'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export const MAP_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MAP_MAX_ZOOM = 19;
export const MAP_MIN_ZOOM = 3;

// Notas sobre uso y migración:
// - OSM es gratis y suficiente para beta cerrada.
// - Política OSM: User-Agent identificable + uso no masivo.
//   Cuando Botanic crezca (>500k tiles/mes), migrar a:
//     · CartoDB Voyager — gratis con atribución, sin API key
//     · Stadia Maps    — free tier con API key
//     · Mapbox         — planes de pago
//     · Self-hosted    — control total, coste de infra
//   Cambio = 1 línea en este archivo + attribution.