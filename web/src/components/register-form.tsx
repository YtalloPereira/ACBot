'use client';

import { Control, Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, confirmSignUp, resendSignUpCode, signUp } from 'aws-amplify/auth';
import { AlertCircle, CheckCircle, Eye, EyeOff, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
  IDialog,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Loading } from './ui/loading';

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Nome é obrigatório' })
      .min(3, 'Nome deve ter ao menos 3 caracteres'),
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
    confirm_password: z.string({
      required_error: 'Confirmação de senha é obrigatória',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas devem ser iguais',
    path: ['confirm_password'],
  });

export type IRegister = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<IDialog>({} as IDialog);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPasswordHidden, setIsPasswordHidden] = useState({
    password: true,
    confirm_password: true,
  });

  const router = useRouter();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleRegister = async (data: IRegister) => {
    try {
      setIsLoading(true);

      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            name: data.name,
          },
        },
      });

      setTimeout(() => {
        setDialog({} as IDialog);
      }, 250);

      setConfirmDialog(true);
    } catch (error) {
      if (error instanceof AuthError) {
        const message = error.name;

        if (message === 'UsernameExistsException') {
          setError('email', { message: 'Email já está em uso' });
        }
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeOverlay = () => {
    setDialog((prev) => ({ ...prev, visible: false }));

    switch (dialog.type) {
      case 'success':
        setTimeout(() => {
          router.push('/login');
          setConfirmDialog(false);
        }, 250);
        break;
      case 'danger':
        setTimeout(() => setDialog({} as IDialog), 250);
        break;
    }
  };

  // Function to confirm the user account with the confirmation code
  const handleConfirmCode = async () => {
    try {
      setIsLoading(true);

      if (confirmCode.length !== 6) {
        setCodeError('Código de confirmação deve ter 6 dígitos');
        return;
      }

      await confirmSignUp({
        confirmationCode: confirmCode,
        username: watch('email'),
      });

      setDialog({
        visible: true,
        type: 'success',
        title: 'Conta criada com sucesso',
        description:
          'Sua conta foi criada e confirmada, agora você será redirecionado para a página inicial.',
        button_span: 'Fechar',
      });
    } catch (error) {
      if (error instanceof AuthError) {
        const message = error.message;

        if (message === 'CodeMismatchException') {
          setCodeError('Código de confirmação inválido');
        }

        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to resend the confirmation code to the user email
  const handleResendConfirmCode = async () => {
    try {
      await resendSignUpCode({ username: watch('email') });
      setTimeLeft(60);
    } catch (error) {
      if (error instanceof AuthError) {
        const message = error.cause;

        if (message === 'LimitExceededException') {
          toast.error('Limite de códigos excedido, tente novamente mais tarde.');
        }

        console.log(error);
      }
    }
  };

  return (
    <>
      <form className="mx-auto flex w-full max-w-lg flex-col space-y-5 p-10">
        <div>
          <h1 className="text-2xl font-bold leading-relaxed">Criar conta</h1>
          <span>
            Já têm uma conta?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 focus-visible:ring-foreground rounded-lg p-0.5 font-bold outline-none hover:underline focus-visible:ring-1"
            >
              Faça login!
            </Link>
          </span>
        </div>

        <Input
          error={errors.name?.message}
          name="name"
          label="Nome"
          data-error={errors.name?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-danger data-[error=true]:focus-within:ring-danger data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('name')}
            placeholder="Seu nome"
            type="text"
            id="name"
            disabled={isLoading}
            className="group-data-[error=true]:text-danger group-data-[error=true]:placeholder:text-danger"
            autoComplete="off"
          />
        </Input>

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
            placeholder="Crie uma senha"
            type={isPasswordHidden.password ? 'password' : 'text'}
            id="password"
            disabled={isLoading}
            className="group-data-[error=true]:text-danger group-data-[error=true]:placeholder:text-danger rounded-r-none"
            autoComplete="off"
          />

          <Button
            onClick={() =>
              setIsPasswordHidden({
                ...isPasswordHidden,
                password: !isPasswordHidden.password,
              })
            }
            data-error={errors.password?.message ? true : false}
            data-enabled={watch('password') ? true : false}
            className="data-[error=true]:data-[selected=true]:text-danger data-[error=true]:text-danger data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:bg-transparent data-[enabled=true]:visible"
            disabled={isLoading}
            variant="icon"
            size="icon"
            type="button"
          >
            {isPasswordHidden.password ? <Eye /> : <EyeOff />}
          </Button>
        </Input>

        <Input
          label="Confirmar senha"
          error={errors.confirm_password?.message}
          name="confirm_password"
          data-error={errors.confirm_password?.message ? true : false}
          data-disabled={isLoading}
          className="data-[error=true]:ring-danger data-[error=true]:focus-within:ring-danger data-[disabled=true]:hover:bg-border/10"
        >
          <Control
            {...register('confirm_password')}
            placeholder="Confirme sua senha"
            type={isPasswordHidden.confirm_password ? 'password' : 'text'}
            id="confirm_password"
            disabled={isLoading}
            className="group-data-[error=true]:text-danger group-data-[error=true]:placeholder:text-danger rounded-r-none"
            autoComplete="off"
          />

          <Button
            onClick={() =>
              setIsPasswordHidden({
                ...isPasswordHidden,
                confirm_password: !isPasswordHidden.confirm_password,
              })
            }
            data-error={errors.confirm_password?.message ? true : false}
            data-enabled={watch('confirm_password') ? true : false}
            className="data-[error=true]:data-[selected=true]:text-danger data-[error=true]:text-danger data-[selected=true]:text-primary group-focus-within:data-[error=false]:text-primary mx-1 disabled:bg-transparent data-[enabled=true]:visible"
            disabled={isLoading}
            variant="icon"
            size="icon"
            type="button"
          >
            {isPasswordHidden.confirm_password ? <Eye /> : <EyeOff />}
          </Button>
        </Input>

        <Button
          disabled={Object.keys(errors).length > 0 || isLoading}
          type="submit"
          onClick={handleSubmit(handleRegister)}
        >
          {isLoading ? (
            <Loading variant="small" size="button" />
          ) : (
            <span>Criar conta</span>
          )}
        </Button>
      </form>
      <AlertDialog open={confirmDialog}>
        <AlertDialogOverlay className="data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_200ms]">
          <AlertDialogContent className="data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[content-show_200ms]">
            <AlertCircle className="text-warning mx-auto size-8" />

            <AlertDialogTitle className="text-center text-xl font-medium">
              {'Código de Confirmação'}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center">
              {'Insira o código de confirmação enviado para o seu e-mail'}
            </AlertDialogDescription>

            <Input
              error={codeError}
              name="confirm_code"
              label="Código de confirmação"
              data-error={codeError.length > 0}
              data-disabled={isLoading}
              className="data-[error=true]:ring-danger data-[error=true]:focus-within:ring-danger data-[disabled=true]:hover:bg-border/10"
            >
              <Control
                placeholder="Insira o código de confirmação"
                value={confirmCode}
                onChange={(e) => {
                  setConfirmCode(e.target.value);
                  setCodeError('');
                }}
                type="number"
                id="code"
                min={6}
                max={6}
                disabled={isLoading}
                className="group-data-[error=true]:text-danger group-data-[error=true]:placeholder:text-danger"
                autoComplete="off"
              />
            </Input>

            <Button
              disabled={timeLeft > 0}
              onClick={handleResendConfirmCode}
              className="max-w-fit px-5 mx-auto w-full"
            >
              {timeLeft > 0 ? `Reenviar código (${timeLeft})` : 'Reenviar código'}
            </Button>

            <Button
              disabled={codeError.length > 0 || isLoading}
              onClick={handleConfirmCode}
              className="max-w-fit px-5 mx-auto w-full  "
            >
              Confirmar
            </Button>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog open={dialog.visible}>
        <AlertDialogOverlay className="data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_200ms]">
          <AlertDialogContent className="data-[state=closed]:animate-[content-hide_200ms] data-[state=open]:animate-[content-show_200ms]">
            {dialog.type === 'success' ? (
              <CheckCircle className="text-success mx-auto size-8" />
            ) : (
              <XCircle className="text-danger mx-auto size-8" />
            )}

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
    </>
  );
};
