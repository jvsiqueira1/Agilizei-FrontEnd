export const formatarData = (isoString: string): string => {
  const data = new Date(isoString)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
