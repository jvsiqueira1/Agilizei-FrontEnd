# **Frontend - Agilizei**

Este é o frontend da Agilizei.

## **Tecnologias Utilizadas**

- **React.js** - Framework principal para construção da interface.
- **TypeScript** - Para adicionar tipagem estática ao código.
- **Tailwind CSS** - Framework de CSS utilitário para facilitar o design responsivo.
- **Axios** - Para realizar requisições HTTP.
- **JWT** - Para autenticação via token.
- **React Router** - Para gerenciamento de rotas no aplicativo.
- **js-cookie** - Para armazenar e gerenciar cookies (usado para salvar o JWT).

## **Funcionalidades**

1. **Autenticação com JWT:**
   - O cliente realiza o login utilizando um código OTP (enviado para o WhatsApp).
   - O token JWT é salvo no `cookie` após o login bem-sucedido e é utilizado para autenticar as requisições.

2. **Visualização de Serviços:**
   - O cliente pode visualizar seus serviços em andamento e finalizados.
   - O sistema exibe informações sobre os serviços como título, status, data, e orçamentos pendentes.

3. **Aceitação de Orçamentos:**
   - O cliente pode visualizar os orçamentos disponíveis para os serviços e aceitá-los diretamente.

4. **Exibição de Orçamentos:**
   - Cada serviço com orçamento pendente mostra a lista de orçamentos disponíveis, com informações sobre o valor e a avaliação do profissional.

5. **Envio de Orçamento (Parceiro):**
   - O parceiro pode enviar um orçamento para um serviço, incluindo valor estimado e descrição.
   - O orçamento enviado fica disponível para o cliente visualizar e aceitar.
   
## **Instruções para Execução do Projeto**

### **Passos para Rodar o Frontend Localmente:**

   Clone este repositório para sua máquina local:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd <NOME_DA_PASTA>
   ```
   Instale as Dependências: Instale as dependências necessárias com o comando:
   ```bash
   npm install
   ```
   Inicie o Servidor de Desenvolvimento: Após a instalação das dependências, inicie o servidor de desenvolvimento com:
   ```bash
   npm run dev
   ```
   Isso iniciará o frontend e a aplicação estará disponível no navegador em http://localhost:5173/.
