import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/constants";
import { LoginForm } from "@/features/auth/components/login-form";
import Link from "next/link";

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{dict.auth.signIn}</h1>
          <p className="text-muted-foreground">
            {dict.common.appName}
          </p>
        </div>

        <LoginForm dict={dict} />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{dict.auth.dontHaveAccount} </span>
          <Link href={`/${lang}/register`} className="text-primary hover:underline font-medium">
            {dict.auth.signUp}
          </Link>
        </div>
      </div>
    </div>
  );
}
