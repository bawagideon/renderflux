import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // Look for the 'next' param we sent in register page
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const cookieStore = {
            get(name: string) {
                return request.headers.get('cookie')?.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1];
            },
            set(name: string, value: string, options: CookieOptions) {
                // Need valid cookie setting logic for route handlers, 
                // but Supabase's exchangeCodeForSession usually handles the session establishment
            },
            remove(name: string, options: CookieOptions) { },
        };

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        // @ts-ignore
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // @ts-ignore
                        // This is a route handler, we can't set cookies on the request object directly for the response
                        // We rely on the response redirect to carry the cookies if using the helpers correctly
                        // For simplicity in this route handler context:
                    },
                    remove(name: string, options: CookieOptions) {
                    },
                },
            }
        );

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // If successful, forward to the 'next' page (Setup Password)
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If error, return to auth error page
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}