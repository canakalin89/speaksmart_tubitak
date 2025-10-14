'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFirebase } from '@/firebase';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';

const formSchema = z.object({
  email: z.string().email({ message: 'Geçerli bir e-posta adresi girin.' }),
  password: z.string().min(6, { message: 'Şifre en az 6 karakter olmalıdır.' }),
  role: z.enum(['student', 'teacher']).default('student'),
});

export function SignUpForm() {
  const { auth, firestore } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'student',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await initiateEmailSignUp(auth, values.email, values.password);
      const user = userCredential.user;
      
      if (user) {
        // Send verification email
        await sendEmailVerification(user);

        // Create a user document in Firestore
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            role: values.role
        });

         toast({
          title: 'Kayıt Başarılı!',
          description: 'Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.',
        });

        // Sign the user out until they verify
        await auth.signOut();

      } else {
         throw new Error("Kullanıcı oluşturulamadı.");
      }
      
    } catch (error: any) {
        console.error(error);
        let description = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.';
        if (error.code === 'auth/email-already-in-use') {
            description = 'Bu e-posta adresi zaten kullanılıyor.';
        }
        toast({
            variant: 'destructive',
            title: 'Kayıt Başarısız',
            description: description,
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input placeholder="ornek@eposta.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
        </Button>
      </form>
    </Form>
  );
}
