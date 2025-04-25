'use client';

import { FaEnvelope, FaLock } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

export default function Home() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    router.push('/device-group');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-extrabold">Centray管理画面</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input placeholder="you@example.com" className="pl-10" type="email" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="pl-10 pr-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
