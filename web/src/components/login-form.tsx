'use client';

import { Control, Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, fetchUserAttributes, signIn } from '@aws-amplify/auth';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Loading } from './ui/loading';

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Endereço de e-mail é obrigatório' })
    .email('Endereço de e-mail inválido'),
  password: z
    .string({ required_error: 'Senha deve ter ao menos 8 caracteres' })
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número')
    .regex(/[^a-zA-Z0-9]/, 'Senha deve conter ao menos um símbolo'),
});

export type ILogin = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<IDialog>({} as IDialog);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const { setUser } = useAuth();

  const router = useRouter();

  const handleLogin = async (data: ILogin) => {
    try {
      setIsLoading(true);

      await signIn({ username: data.email, password: data.password });

      const loadedUser = await fetchUserAttributes();
      setUser(loadedUser);

      router.push('/');
    } catch (error) {
      if (error instanceof AuthError) {
        const message = error.message;

        if (message === 'Incorrect username or password.') {
          setError('email', { message: 'Credenciais incorretas' });
          setError('password', { message: 'Credenciais incorretas' });
        } else {
          setDialog({
            visible: true,
            type: 'danger',
            title: 'Ocorreu um erro ao fazer login',
            description: message,
            button_span: 'Fechar',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeOverlay = () => {
    setDialog((prev) => ({ ...prev, visible: false }));
    setTimeout(() => setDialog({} as IDialog), 250);
  };

  return (
    <form className="mx-auto flex w-full max-w-lg flex-col space-y-5 p-10">
      <div>
        <h1 className="text-2xl font-bold leading-relaxed">Entrar</h1>
        <span>
          Não têm uma conta?{' '}
          <Link
            href="/register"
            className="text-primary hover:text-primary/90 focus-visible:ring-foreground rounded-lg p-0.5 font-bold outline-none hover:underline focus-visible:ring-1"
          >
            Criar conta!
          </Link>
        </span>
      </div>

      <Input
        error={errors.email?.message}
        name="email"
        label="E-mail"
        data-error={errors.email?.message ? true : false}
        data-disabled={isLoading}
        className="data-[error=true]:ring-danger data-[error=true]:focus-within:ring-danger data-[disabled=true]:hover:bg-border/10"
      >
        <Control
          {...register('email')}
          placeholder="Seu e-mail"
          type="email"
          id="email"
          disabled={isLoading}
          className="group-data-[error=true]:text-danger group-data-[error=true]:placeholder:text-danger"
          autoComplete="off"
        />
      </Input>

      <Input
        label="Senha"
        error={errors.password?.message}
        name="password"
        data-error={errors.password?.message ? true : false}
        data-disabled={isLoading}
        className="data-[error=true]:ring-danger data-[error=true]:focus-within:ring-danger data-[disabled=true]:hover:bg-border/10"
      >
        <Control
          {...register('password')}
          placeholder="Sua senha"
          type={isPasswordHidden ? 'password' : 'text'}
          id="password"
          disabled={isLoading}
          className="group-data-[error=true]:text-danger group-data-[error=true]:placeholder:text-danger rounded-r-none"
          autoComplete="off"
        />

        <Button
          onClick={() => setIsPasswordHidden(!isPasswordHidden)}
          data-error={errors.password?.message ? true : false}
          data-enabled={watch('password') ? true : false}
          className="data-[error=true]:data-[selected=true]:text-danger data-[error=true]:text-danger data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:hover:bg-transparent data-[enabled=true]:visible"
          variant="icon"
          size="icon"
          type="button"
          disabled={isLoading}
        >
          {isPasswordHidden ? <Eye /> : <EyeOff />}
        </Button>
      </Input>

      <Link
        href="/reset"
        className="text-primary hover:text-primary/90 focus-visible:ring-foreground ml-auto rounded-lg p-0.5 font-bold outline-none hover:underline focus-visible:ring-1"
      >
        Esqueceu sua senha?
      </Link>

      <Button
        disabled={Object.keys(errors).length > 0 || isLoading}
        type="submit"
        onClick={handleSubmit(handleLogin)}
      >
        {isLoading ? <Loading variant="small" size="button" /> : <span>Entrar</span>}
      </Button>

      <AlertDialog open={dialog.visible}>
        <AlertDialogOverlay className="data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_200ms]">
          <AlertDialogContent className="data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[content-show_200ms]">
            <XCircle className="text-danger mx-auto size-8" />

            <AlertDialogTitle className="text-center text-xl font-medium">
              {dialog.title}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center">
              {dialog.description}
            </AlertDialogDescription>

            <Button
              onClick={handleChangeOverlay}
              className="max-w-fit px-5 mx-auto w-full  "
            >
              {dialog.button_span}
            </Button>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </form>
  );
};
