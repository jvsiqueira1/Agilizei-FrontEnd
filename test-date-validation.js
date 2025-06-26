// Teste para validar se a função de validação de data está funcionando
function validateBrazilianDate(dateString) {
  if (!dateString) return false

  // Regex para formato DD/MM/YYYY
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const match = dateString.match(regex)

  if (!match) return false

  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1 // Mês começa em 0 no JavaScript
  const year = parseInt(match[3], 10)

  // Cria a data e verifica se é válida
  const date = new Date(year, month, day)

  // Verifica se a data é válida (não é NaN e os valores correspondem)
  const isValidDate =
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year &&
    !isNaN(date.getTime())

  if (!isValidDate) return false

  // Verifica se a data não é no passado (compara apenas a data, não o horário)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  return date >= today
}

// Testes
console.log('Testando validação de datas:')
console.log('25/06/2025 (futura):', validateBrazilianDate('25/06/2025'))
console.log('25/12/2024 (passada):', validateBrazilianDate('25/12/2024'))
console.log('32/13/2025 (inválida):', validateBrazilianDate('32/13/2025'))
console.log('25-06-2025 (formato errado):', validateBrazilianDate('25-06-2025'))
console.log('25/6/2025 (formato errado):', validateBrazilianDate('25/6/2025'))
console.log('vazio:', validateBrazilianDate(''))

// Teste de conversão de formato
function convertToISO(dateString) {
  if (!dateString) return null
  const [day, month, year] = dateString.split('/')
  return `${year}-${month}-${day}`
}

console.log('\nTestando conversão para ISO:')
console.log('25/06/2025 ->', convertToISO('25/06/2025'))
console.log('01/12/2025 ->', convertToISO('01/12/2025'))
