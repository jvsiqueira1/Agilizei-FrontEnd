import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default function PartnerForm() {
  const form = useForm({
    defaultValues: {
      nome: '',
      email: '',
      cpfCnpj: '',
      dataNascimento: '',
      telefone: '',
      endereco: '',
      servico: '',
      fotoDocumento: undefined,
      termosAceitos: false,
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log('Cadastro de Prestador:', data)
  }

  return (
    <Form {...form}>
      <div className="flex justify-center mb-4">
        <img src="agilizeiLogo.svg" alt="Agilizei Logo" />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpfCnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="CPF ou CNPJ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Selecione uma data"
                    {...field}
                    className="date-[size=large]:p-8"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="Telefone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço Prestado</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faxineira">Faxineira</SelectItem>
                    <SelectItem value="Eletricista">Eletricista</SelectItem>
                    <SelectItem value="Pintor">Pintor</SelectItem>
                    <SelectItem value="Montador de Móveis">
                      Montador de Móveis
                    </SelectItem>
                    <SelectItem value="Jardineiro">Jardineiro</SelectItem>
                    <SelectItem value="Pedreiro">Pedreiro</SelectItem>
                    <SelectItem value="Freteiro">Freteiro</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fotoDocumento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verificação de Identidade</FormLabel>
              <FormControl>
                <Input type="file" accept="image/png, image/jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termosAceitos"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <label className="flex items-center">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mr-2"
                  />
                  Li e aceito os{' '}
                  <a href="#" className="text-blue-600 hover:underline ml-1">
                    Termos e Condições de Uso
                  </a>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-center">
          <Button type="submit">Cadastrar Prestador</Button>
        </div>
      </form>
    </Form>
  )
}
