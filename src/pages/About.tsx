import { Header, Footer } from '@/components'
import { useMenu } from '@/contexts/useMenu'

export default function About() {
  const { openMenu } = useMenu()
  return (
    <>
      <Header />
      <main
        className={`w-[92%] mx-auto my-8 ${openMenu ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <section className="flex flex-col md:flex-row items-center mb-8">
          <div className="md:w-1/2 p-4">
            <h1 className="text-4xl font-bold mb-4">Quem somos?</h1>
            <p className="mb-4">
              A AGILIZE é a uma plataforma online de serviços, criada para
              conectar quem precisa de soluções a quem sabe fazer com
              excelência. Somos o elo entre clientes e profissionais autônomos,
              transformando necessidades em resultados rápidos, seguros e de
              qualidade.
            </p>
          </div>
          <div className="md:w-1/2 p-4">
            <img
              src="/AGILIZE_SOBRE.jpeg"
              alt="Descrição da imagem"
              className="rounded-lg w-full transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          </div>
        </section>
        <section className="flex flex-col md:flex-row items-center mb-8 bg-[#DB4E1E] p-4 rounded-lg">
          <div className="md:w-1/2 p-4 flex justify-center">
            <img
              src="agilizei.png"
              alt="Descrição da imagem"
              className="rounded-lg max-w-80 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          </div>
          <div className="md:w-1/2 p-4">
            <h2 className="text-3xl font-semibold text-white">
              O Que nos torna Únicos?
            </h2>
            <br />
            <p className="text-white">
              - Tecnologia inteligente: Plataforma intuitiva que encontra o
              profissional perfeito em poucos cliques.
              <br />
              - Impacto social: Geramos oportunidades para milhares de autônomos
              e microempreendedores.
              <br />
              - Compromisso 24/7: Suporte humano sempre disponível para garantir
              sua satisfação.
              <br />
              <br />
              "Na AGILIZE, não vendemos serviços – criamos experiências que
              facilitam sua vida."
            </p>
          </div>
        </section>
        <section className="bg-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <svg className="mb-2" width="24" height="24">
                <use xlinkHref="#icon-shield" />
              </svg>
              <h3 className="font-bold">Confiança acima de tudo</h3>
              <p>
                Segurança para clientes e profissionais, com avaliações
                transparentes e suporte dedicado.{' '}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="mb-2" width="24" height="24">
                <use xlinkHref="#icon-lightning" />
              </svg>
              <h3 className="font-bold">Agilidade que transforma</h3>
              <p>
                Respostas rápidas e soluções sem burocracia, do pedido à
                realização.{' '}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="mb-2" width="24" height="24">
                <use xlinkHref="#icon-star" />
              </svg>
              <h3 className="font-bold">Excelência em cada detalhe</h3>
              <p>
                Só trabalhamos com os melhores profissionais, comprometidos com
                qualidade.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="mb-2" width="24" height="24">
                <use xlinkHref="#icon-handshake" />
              </svg>
              <h3 className="font-bold">Conexão humana</h3>
              <p>Por trás de cada serviço, há pessoas ajudando pessoas. </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
