const SPACE_KEY = 'RO'
const LABELS = ['reto-pir', 'reto-pir-26']
const EMAIL = import.meta.env.VITE_CONFLUENCE_EMAIL
const TOKEN = import.meta.env.VITE_CONFLUENCE_API_TOKEN

function authHeader() {
  return {
    Authorization: `Basic ${btoa(`${EMAIL}:${TOKEN}`)}`,
    'Content-Type': 'application/json',
  }
}

async function getV1(path) {
  const res = await fetch(`/wiki/rest/api${path}`, { headers: authHeader() })
  if (!res.ok) throw new Error(`Confluence API error: ${res.status} ${res.statusText}`)
  return res.json()
}

async function searchByLabel(label) {
  const cql = encodeURIComponent(`label="${label}" AND space="${SPACE_KEY}" AND type=page`)
  const data = await getV1(`/content/search?cql=${cql}&limit=100&expand=body.export_view,version,history`)
  return data.results
}

// Parse Page Properties macro — renders as a table with <th> key / <td> value rows
function parsePageProperties(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const props = {}

  for (const row of doc.querySelectorAll('tr')) {
    const th = row.querySelector('th')
    const td = row.querySelector('td')
    if (!th || !td) continue
    // Skip cells that are dynamic macro iframes (contain scripts)
    if (td.querySelector('script, noscript, iframe')) continue
    const val = td.textContent.trim()
    // Skip if the value looks like script/CDATA noise
    if (!val || val.startsWith('//') || val.includes('CDATA') || val.length > 500) continue
    props[th.textContent.trim()] = val
  }

  // Fallback: definition list format
  for (const dl of doc.querySelectorAll('dl')) {
    const items = Array.from(dl.children)
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].tagName === 'DT' && items[i + 1]?.tagName === 'DD') {
        props[items[i].textContent.trim()] = items[i + 1].textContent.trim()
      }
    }
  }

  return props
}

function normalizeStatus(val) {
  if (!val) return 'Created'
  const v = val.trim()
  if (/^created$/i.test(v)) return 'Created'
  if (/rca|impact.?analysis|root.?cause|investigat/i.test(v)) return 'RCA & Impact Analysis'
  if (/implement|mitigation|in.?progress|wip|ongoing/i.test(v)) return 'Implementing Mitigations'
  if (/ops.?review|operations.?review/i.test(v)) return 'OPS Review'
  if (/approv|resolv|fixed|done|complete|clos/i.test(v)) return 'Approved'
  return 'Created'
}

function normalizePriority(val) {
  if (!val) return 'Sev-3'
  const v = val.trim()
  if (/sev[-\s]?1|critical|p0/i.test(v)) return 'Sev-1'
  if (/sev[-\s]?2|high|p1/i.test(v)) return 'Sev-2'
  if (/sev[-\s]?3|med|p2/i.test(v)) return 'Sev-3'
  if (/sev[-\s]?4|low|p3/i.test(v)) return 'Sev-4'
  if (/sev[-\s]?5|p4/i.test(v)) return 'Sev-5'
  return 'Sev-3'
}

function mapPropsToIncident(props, page) {
  console.log(`[Confluence] "${page.title}" props:`, props)

  const pageUrl = `https://centricaenergy.atlassian.net/wiki${page._links?.webui || `/spaces/${SPACE_KEY}/pages/${page.id}`}`
  const rawDate = props['Date/Time of the Incident'] || props['Date'] || ''
  const createdAt = rawDate ? rawDate.split('T')[0] : (page.history?.createdDate || '').split('T')[0]
  const updatedAt = (page.version?.when || '').split('T')[0] || createdAt

  return {
    id: props['Incident ID'] || page.id,
    title: page.title,
    status: normalizeStatus(props['PIR Status'] || props['Status']),
    priority: normalizePriority(props['Severity level'] || props['Severity'] || props['Priority']),
    category: props['Root Cause Identified'] || props['Category'] || props['ISO27001 significant'] || 'General',
    assignee: props['Assigned To'] || props['Owner'] || props['Assignee'] || '—',
    reporter: props['Review Facilitator'] || props['Reporter'] || page.history?.createdBy?.displayName || '—',
    createdAt,
    updatedAt,
    description: props['Business Impact'] || props['Description'] || props['Impact'] || '',
    confluenceUrl: pageUrl,
  }
}

export async function fetchAllIncidents() {
  const allIncidents = []
  const seenIds = new Set()

  for (const label of LABELS) {
    const pages = await searchByLabel(label)
    console.log(`[Confluence] Label "${label}" — ${pages.length} pages found`)

    for (const page of pages) {
      if (seenIds.has(page.id)) continue
      seenIds.add(page.id)

      const html = page.body?.export_view?.value || page.body?.view?.value || ''
      const props = parsePageProperties(html)
      allIncidents.push(mapPropsToIncident(props, page))
    }
  }

  return allIncidents
}
