import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .regex(/[A-Z]/, { message: 'パスワードには大文字を少なくとも1つ含めてください' })
    .regex(/[a-z]/, { message: 'パスワードには小文字を少なくとも1つ含めてください' })
    .regex(/[0-9]/, { message: 'パスワードには数字を少なくとも1つ含めてください' }),
});

type FormValues = z.infer<typeof formSchema>;

export function useLogin() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ログイン処理
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage('ログインに失敗しました');
      } else if (result?.ok) {
        router.push('/session-management');
      }
    } catch (error) {
      setErrorMessage('ログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    errorMessage,
    isLoading,
    onSubmit,
  };
}

export type { FormValues };