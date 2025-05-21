// import { api } from './api'

// interface EnviarOTPParams {
//   telefone: string
//   tipo: 'cliente' | 'prestador'
// }

// interface VerificarOTPParams {
//   telefone: string
//   codigo: string
// }

// interface Usuario {
//   id: string
//   telefone: string
//   tipo: 'cliente' | 'prestador'
// }

// interface OTPResponse {
//   sucesso: boolean
//   token?: string
//   usuario?: Usuario
//   erro?: string
// }

// interface ApiError {
//   response?: {
//     data?: {
//       erro: string
//     }
//   }
// }

// export const authService = {
//     const enviarCodigo = async (telefoneCliente: string) => {
//         const telefoneLimpo = telefoneCliente.replace(/\D/g, '')
//         console.log('enviar codigo!! ' + telefoneLimpo)
//         try {
//           const { data } = await api.post('/auth/enviar-otp', {
//             telefone: telefoneLimpo,
//             tipo: 'cliente',
//           })
//           if (data) {
//             setStep('otp')
//             setMensagem('Código enviado para seu WhatsApp')
//           } else {
//             setMensagem(data.erro || 'Erro ao enviar o código.')
//           }
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//           console.error(error)
//           setMensagem(error.response?.data?.erro || 'Erro ao enviar o código.')
//         }
//       }

//       const verificarCodigo = async () => {
//         const telefoneLimpo = telefone.replace(/\D/g, '')
//         console.log('verificar codigo ' + telefoneLimpo)

//         try {
//           const { data } = await api.post('/auth/verificar-otp', {
//             telefone: telefoneLimpo,
//             codigo,
//           })
//           console.log('Verificar OTP', { data })
//           if (data.sucesso && data.token && data.usuario) {
//             Cookies.set('token', data.token, { expires: 1 })
//             login('client', data.token)
//             setMensagem('Login realizado com sucesso!')

//             setTimeout(() => {
//               navigate('/cliente')
//               onClose()
//             }, 1500)
//           } else {
//             setMensagem(data.erro || 'Código incorreto.')
//           }
//         } catch (error) {
//           console.error(error)
//           setMensagem('Erro ao verificar código.')
//         }
//       }
// }
