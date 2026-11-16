# SEO y despliegue — Asociación Galileo

Checklist operativo fuera del código. Sin esto, las mejoras on-page no se indexan bien.

## Bloqueo actual: HTTP 500

Al auditar (nov 2026), `https://asociaciongalileoaltascapacidades.es/` respondía **HTTP 500**. Mientras el dominio falle, Google no puede rastrear ni posicionar la web.

### Hosting (hacer primero)

1. Restaurar el sitio estático (subir HTML/CSS/JS/assets o reparar el servidor).
2. Servir `index.html` en `/` y redirigir con **301** `/index.html` → `/`.
3. HTTPS con certificado válido (sin mixed content).
4. Publicar `robots.txt`, `sitemap.xml` y `404.html` en la raíz del dominio.
5. Comprobar en el navegador: inicio, recursos, juegos, contacto, privacidad y una URL inventada (404).

## Google Search Console

1. Verificar la propiedad del dominio (DNS o archivo HTML).
2. Enviar `https://asociaciongalileoaltascapacidades.es/sitemap.xml`.
3. Solicitar indexación de `/`, `/recursos.html`, `/juegos.html` y `/contacto.html`.
4. Revisar Cobertura / Páginas, Core Web Vitals y consultas de búsqueda.

## SEO local y citaciones

Datos NAP canónicos (ya públicos en la Consejería de Educación de CLM):

- **Nombre:** Asociación Galileo Altas Capacidades Intelectuales
- **Dirección:** Centro Cívico Plaza de España, Alcázar de San Juan, Ciudad Real
- **Teléfono:** 675 108 804
- **Email:** altascapacidadesgalileo@gmail.com
- **Web:** https://asociaciongalileoaltascapacidades.es/

Acciones:

1. Crear o reclamar el **perfil de Google Business** con esos datos y la URL de la web.
2. Pedir a la [ficha de la Consejería](https://educacion.castillalamancha.es/inclusion-convivencia/altas-capacidades) que añada la web (hoy solo aparecen email/Facebook/teléfono).
3. Actualizar directorios (asociacionesciudadreal, listados AACC) para enlazar la web, no solo Facebook.
4. Unificar NAP en Instagram, Facebook y materiales impresos.
5. En próximas notas de prensa locales, incluir el enlace canónico a la web.

## Medición

- Revisar Search Console cada mes (consultas P0/P1 locales y de marca).
- Actualizar `lastmod` en `sitemap.xml` cuando cambie el contenido relevante.
- Validar datos estructurados con la herramienta de resultados enriquecidos de Google tras cada despliegue.
