import { Header, Footer } from '@/components'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useMenu } from '@/contexts/useMenu'

export default function FAQ() {
  const { openMenu } = useMenu()
  return (
    <>
      <Header />
      <div
        className={`w-full max-w-3xl mx-auto p-4 md:p-10 bg-orange text-white rounded-2xl mt-10 mb-20 ${openMenu ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <h1 className="text-4xl font-bold text-center mb-8">
          Perguntas Frequentes
        </h1>
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger>O que é a Agilizei?</AccordionTrigger>
            <AccordionContent>
              A Agilizei é uma plataforma digital que conecta prestadores de
              serviços autônomos a clientes que precisam de serviços como
              limpeza, pintura, montagem de móveis e eletricista. Nossa missão é
              proporcionar conexões seguras, rápidas e de qualidade.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Como funciona a plataforma?</AccordionTrigger>
            <AccordionContent>
              Basta acessar a Agilizei, buscar o serviço desejado e escolher um
              profissional com base nas avaliações e experiência. O prestador de
              serviço entrará em contato para combinar os detalhes e realizar o
              serviço.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Quais serviços posso encontrar na Agilizei?
            </AccordionTrigger>
            <AccordionContent>
              Atualmente, temos prestadores para: Faxina e limpeza, Montagem de
              móveis, Pintura, Eletricista e outros.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Como faço para contratar um prestador de serviço?
            </AccordionTrigger>
            <AccordionContent>
              Acesse a plataforma e crie uma oportunidade de serviço, informando
              o que precisa. Você receberá orçamentos de profissionais
              disponíveis. Escolha o profissional que melhor atende às suas
              necessidades. O prestador entrará em contato para combinar os
              detalhes do serviço. O pagamento será feito diretamente ao
              prestador após a conclusão do serviço.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              Como me cadastro como prestador de serviço?
            </AccordionTrigger>
            <AccordionContent>
              Acesse a plataforma e clique em "Seja Nosso Parceiro". Preencha
              suas informações, habilidades e disponibilidade. Aguarde a
              verificação e comece a receber pedidos!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>
              Como a Agilizei garante a qualidade dos prestadores?
            </AccordionTrigger>
            <AccordionContent>
              Todos os prestadores cadastrados na plataforma passam por uma
              verificação e podem receber avaliações de clientes anteriores. Em
              breve, também ofereceremos programas de qualificação para que os
              profissionais possam aprimorar seus serviços e se destacarem no
              mercado.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>
              Os prestadores são formalizados?
            </AccordionTrigger>
            <AccordionContent>
              A Agilizei incentiva a formalização dos prestadores e oferece
              suporte para que eles possam atuar como MEI (Microempreendedor
              Individual), garantindo mais segurança e benefícios.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>
              A Agilizei cobra alguma taxa dos prestadores?
            </AccordionTrigger>
            <AccordionContent>
              Sim. Para manter a plataforma funcionando e oferecer suporte aos
              profissionais, a Agilizei retém uma pequena taxa sobre o valor de
              cada serviço realizado.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger>
              O que faço se tiver um problema com o serviço?
            </AccordionTrigger>
            <AccordionContent>
              Se tiver qualquer problema com o serviço prestado, entre em
              contato com nosso suporte pelo chat da plataforma ou e-mail. Nossa
              equipe analisará o caso e ajudará a resolver da melhor forma
              possível.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger>
              A Agilizei está disponível em quais regiões?
            </AccordionTrigger>
            <AccordionContent>
              Atualmente, estamos operando em Linhares/ES, e em breve
              expandiremos para todo o estado do Espírito Santo.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11">
            <AccordionTrigger>
              Como posso entrar em contato com o suporte da Agilizei?
            </AccordionTrigger>
            <AccordionContent>
              Você pode falar com nossa equipe pelo chat da plataforma ou pelo
              e-mail arsacompany.agilizei@gmail.com.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </>
  )
}
