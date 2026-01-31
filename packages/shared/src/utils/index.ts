// Utils compartilhados entre frontend e backend
// Por enquanto vazio, será preenchido conforme necessário

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}
