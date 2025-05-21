export function deixaNumeros(texto: string): string {
  return texto.replace(/\D/g, '')
}

export function validaCpf(cpf: string): boolean {
  if (!cpf || cpf.trim() === '') {
    return false
  }

  cpf = deixaNumeros(cpf)

  if (cpf.length !== 11) {
    return false
  }

  if (new Set(cpf.split('')).size === 1) {
    return false
  }

  const multiplicador1 = [10, 9, 8, 7, 6, 5, 4, 3, 2]
  const multiplicador2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]

  let tempCpf = cpf.substring(0, 9)
  let soma = 0

  for (let i = 0; i < 9; i++) {
    soma += parseInt(tempCpf[i]) * multiplicador1[i]
  }

  let resto = soma % 11
  if (resto < 2) {
    resto = 0
  } else {
    resto = 11 - resto
  }

  const digito = resto.toString()
  tempCpf = tempCpf + digito
  soma = 0

  for (let i = 0; i < 10; i++) {
    soma += parseInt(tempCpf[i]) * multiplicador2[i]
  }

  resto = soma % 11
  if (resto < 2) {
    resto = 0
  } else {
    resto = 11 - resto
  }

  const digitoVerificador = digito + resto.toString()
  return cpf.endsWith(digitoVerificador)
}

export function validaCnpj(cnpj: string): boolean {
  if (!cnpj || cnpj.trim() === '') {
    return false
  }

  cnpj = deixaNumeros(cnpj)

  if (cnpj.length !== 14) {
    return false
  }

  if (new Set(cnpj.split('')).size === 1) {
    return false
  }

  const multiplicador1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const multiplicador2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let tempCnpj = cnpj.substring(0, 12)
  let soma = 0

  for (let i = 0; i < 12; i++) {
    soma += parseInt(tempCnpj[i]) * multiplicador1[i]
  }

  let resto = soma % 11
  if (resto < 2) {
    resto = 0
  } else {
    resto = 11 - resto
  }

  const digito = resto.toString()
  tempCnpj = tempCnpj + digito
  soma = 0

  for (let i = 0; i < 13; i++) {
    soma += parseInt(tempCnpj[i]) * multiplicador2[i]
  }

  resto = soma % 11
  if (resto < 2) {
    resto = 0
  } else {
    resto = 11 - resto
  }

  const digitoVerificador = digito + resto.toString()
  return cnpj.endsWith(digitoVerificador)
}

export function validaCpfCnpj(valor: string): boolean {
  const numero = deixaNumeros(valor)

  if (numero.length === 11) {
    return validaCpf(numero)
  }

  if (numero.length === 14) {
    return validaCnpj(numero)
  }

  return false
}
