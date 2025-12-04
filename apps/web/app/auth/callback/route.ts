import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const cookieStore = {
            get(name: string) {
                return request.headers.get('cookie')?.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1];
            },
            set(name: string, value: string, options: CookieOptions) {
                // We can't set cookies on the request, but we need this for the client to work
            },
            remove(name: string, options: CookieOptions) {
                // We can't remove cookies on the request
            },
        };

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.headers.get('cookie')?.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1];
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Handled by response
                    },
                    remove(name: string, options: CookieOptions) {
                        // Handled by response
                    },
                },
            }
        );

        // We need to create a response to set cookies on
        const response = NextResponse.redirect(`${origin}${next}`);

        // Re-create client with response-aware cookie handling for the exchange
        const supabaseResponse = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.headers.get('cookie')?.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1];
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        });
                    },
                    remove(name: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        });
                    },
                },
            }
        );

        const { error } = await supabaseResponse.auth.exchangeCodeForSession(code);

        if (!error) {
            return response;
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
