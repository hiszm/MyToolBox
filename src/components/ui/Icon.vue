<script setup lang="ts">
/**
 * Single SVG component renders any tool icon by name.
 * All icons use Lucide-style: 24x24, 1.5px stroke, currentColor.
 */
defineProps<{ name: string; class?: string }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    :class="$props.class"
  >
    <!-- type — letter T -->
    <g v-if="name === 'type'">
      <path d="M4 7V5h16v2" /><path d="M9 19h6" /><path d="M12 5v14" />
    </g>
    <!-- languages -->
    <g v-else-if="name === 'languages'">
      <path d="M5 8h6M8 5v3M6.5 14l3-6 3 6M7 12h5" /><path d="M13 21l6-12 6 12" /><path d="M15 17h8" />
    </g>
    <!-- clock -->
    <g v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </g>
    <!-- binary -->
    <g v-else-if="name === 'binary'">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
      <path d="M14 4h2v6M14 10h4" /><path d="M4 14h6v6M4 20h6" />
    </g>
    <!-- link -->
    <g v-else-if="name === 'link'">
      <path d="M9 17H7a5 5 0 010-10h2" /><path d="M15 7h2a5 5 0 010 10h-2" /><path d="M8 12h8" />
    </g>
    <!-- shield -->
    <g v-else-if="name === 'shield'">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </g>
    <!-- hash -->
    <g v-else-if="name === 'hash'">
      <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
    </g>
    <!-- fingerprint -->
    <g v-else-if="name === 'fingerprint'">
      <path d="M6 19c1-3 1.5-6 1.5-8a4.5 4.5 0 019 0c0 4 .5 7 1.5 9" />
      <path d="M12 15c0-5 0-7 0-7" />
      <path d="M9 11c0-3 1.5-5 3-5s3 2 3 5" />
      <path d="M9 19c0-3 .5-5 1-7" />
    </g>
    <!-- qrcode -->
    <g v-else-if="name === 'qrcode'">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v3M14 20h3M20 20h.01" />
    </g>
    <!-- palette -->
    <g v-else-if="name === 'palette'">
      <path
        d="M12 3a9 9 0 100 18c1 0 1.5-.5 1.5-1.5 0-.5-.3-1-.6-1.4-.5-.7-.4-1.6.2-2.2.4-.4 1-.6 1.5-.6h2a4 4 0 004-4c0-4.5-3.6-8-8.6-8z"
      />
      <circle cx="7.5" cy="10.5" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="16.5" cy="10.5" r="1" />
    </g>
    <!-- braces / JSON -->
    <g v-else-if="name === 'braces'">
      <path d="M8 3H6a2 2 0 00-2 2v4a2 2 0 01-2 2 2 2 0 012 2v4a2 2 0 002 2h2" />
      <path d="M16 3h2a2 2 0 012 2v4a2 2 0 002 2 2 2 0 00-2 2v4a2 2 0 01-2 2h-2" />
    </g>
    <!-- code -->
    <g v-else-if="name === 'code'">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </g>
    <!-- search / regex -->
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5" />
    </g>
    <!-- diff -->
    <g v-else-if="name === 'diff'">
      <path d="M12 3v18" /><rect x="4" y="5" width="6" height="6" rx="1" /><rect x="14" y="13" width="6" height="6" rx="1" />
    </g>
    <!-- cloud -->
    <g v-else-if="name === 'cloud'">
      <path d="M17 18a4 4 0 000-8h-.5A6 6 0 005 12a4 4 0 002 7h10z" />
    </g>
    <!-- set (intersecting circles) -->
    <g v-else-if="name === 'set'">
      <circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" />
    </g>
    <!-- database -->
    <g v-else-if="name === 'database'">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </g>
    <!-- rows -->
    <g v-else-if="name === 'rows'">
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <rect x="3" y="11" width="18" height="5" rx="1" />
      <rect x="3" y="18" width="18" height="2" rx="1" />
    </g>
    <!-- contacts -->
    <g v-else-if="name === 'contacts'">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="11" r="3" />
      <path d="M7 18c1-2 3-3 5-3s4 1 5 3" />
    </g>
    <!-- calendar -->
    <g v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </g>
    <!-- progress -->
    <g v-else-if="name === 'progress'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 019 9" stroke-width="2.5" />
    </g>
    <!-- sun / moon for theme -->
    <g v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </g>
    <g v-else-if="name === 'moon'">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </g>
    <!-- github -->
    <g v-else-if="name === 'github'">
      <path
        d="M12 2a10 10 0 00-3.16 19.49c.5.09.66-.22.66-.48v-1.85c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10 10 0 0012 2z"
      />
    </g>
    <!-- globe (lang switch) -->
    <g v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 4 6.5 4 9s-1.5 6-4 9c-2.5-3-4-6.5-4-9s1.5-6 4-9z" />
    </g>
    <!-- copy -->
    <g v-else-if="name === 'copy'">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </g>
    <!-- check -->
    <g v-else-if="name === 'check'">
      <path d="M20 6L9 17l-5-5" />
    </g>
    <!-- download -->
    <g v-else-if="name === 'download'">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </g>
    <!-- arrow-left -->
    <g v-else-if="name === 'arrow-left'">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </g>
    <!-- menu / sparkles for hero -->
    <g v-else-if="name === 'sparkles'">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
      <path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7zM5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </g>
    <!-- arrow-right -->
    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </g>
    <!-- chevron-right -->
    <g v-else-if="name === 'chevron-right'">
      <path d="M9 18l6-6-6-6" />
    </g>
    <!-- external -->
    <g v-else-if="name === 'external'">
      <path d="M15 3h6v6M21 3l-9 9M14 11v8a2 2 0 01-2 2H5a2 2 0 01-2-2V12a2 2 0 012-2h8" />
    </g>
    <!-- box / fallback -->
    <g v-else>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 9h6v6H9z" />
    </g>
  </svg>
</template>
