export async function fetchKanjiSvg(char: string): Promise<string[]> {
  try {
    // Convert character to unicode hex, padded to 5 digits
    // Example: '東' (U+6771) -> '06771'
    const unicodeHex = char.charCodeAt(0).toString(16).padStart(5, '0')

    // Fetch from KanjiVG GitHub raw (CORS: access-control-allow-origin: *)
    const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${unicodeHex}.svg`
    const response = await fetch(url)

    if (!response.ok) {
      console.error(`KanjiVG fetch failed for '${char}' (${unicodeHex}): ${response.status}`)
      return []
    }

    const svgText = await response.text()

    // Parse XML and extract path elements
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgText, 'image/svg+xml')

    // Check for XML parse error
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      console.error(`XML parse error for '${char}'`)
      return []
    }

    // KanjiVG paths are inside <g> elements; extract all <path> d attributes
    const pathElements = doc.querySelectorAll('path')
    const pathData = Array.from(pathElements)
      .map((p) => p.getAttribute('d') ?? '')
      .filter(Boolean)

    console.log(`Fetched '${char}' (${unicodeHex}): ${pathData.length} strokes`)
    return pathData
  } catch (error) {
    console.error('fetchKanjiSvg error:', error)
    return []
  }
}
