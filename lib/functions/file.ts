import { type AxiosInstance } from 'axios'

// fileDownload handles downloading files from the API, given a URL and optional request headers.
// It expects the API to return a proper content-disposition header with filename, e.g. "attachment; filename=Countries.xlsx".
export async function fileDownload(
  ax: AxiosInstance,
  url: string,
  reqHeaders?: Record<string, string>
) {

  const resp = await ax.get(url, { responseType: 'blob', headers: reqHeaders })

  const contentType = getHeaderValue(resp.headers as Record<string, string | undefined>, 'content-type') ?? resp.data.type ?? ''

  // Exit if API returned JSON/text error payload instead of a downloadable file.
  if (contentType.includes('application/json') || contentType.startsWith('text/')) {
    return
  }

  const contentDisposition = getHeaderValue(resp.headers as Record<string, string | undefined>, 'content-disposition')
  const fileName = sanitizeFileName(getFileNameFromContentDisposition(contentDisposition) ?? 'download')
  const blob = new Blob([resp.data], { type: contentType || 'application/octet-stream' })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  link.remove()

  // Delay revocation slightly for better browser compatibility.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
}

function getHeaderValue(headers: Record<string, string | undefined>, name: string): string | undefined {
  const lowerName = name.toLowerCase()
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lowerName) {
      return value
    }
  }
  return undefined
}

function getFileNameFromContentDisposition(contentDisposition?: string): string | undefined {
  if (!contentDisposition) {
    return undefined
  }

  // RFC 5987 first: filename*=UTF-8''encoded-name.ext
  const encodedMatch = contentDisposition.match(/filename\*=([^;]+)/i)
  if (encodedMatch?.[1]) {
    const encodedValue = encodedMatch[1].trim()
    const parts = encodedValue.split("''")
    const encodedName = (parts.length > 1 ? parts[1] : parts[0]) ?? ''
    if (!encodedName) {
      return undefined
    }
    try {
      return decodeURIComponent(encodedName.replace(/^"|"$/g, ''))
    } catch {
      return encodedName.replace(/^"|"$/g, '')
    }
  }

  // Fallback: filename="name.ext" or filename=name.ext
  const plainMatch = contentDisposition.match(/filename=([^;]+)/i)
  if (plainMatch?.[1]) {
    return plainMatch[1].trim().replace(/^"|"$/g, '')
  }

  return undefined
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[\\/:*?"<>|]/g, '_').trim() || 'download'
}