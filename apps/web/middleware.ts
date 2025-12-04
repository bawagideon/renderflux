import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // 1. Create the response object early so we can modify headers/cookies
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // 2. Initialize Supabase Client (Handles Session Refreshing)
    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // 3. Check Session
    const { data: { session } } = await supabase.auth.getSession();

    const path = request.nextUrl.pathname;

    // PROTECTED ROUTES: Dashboard & Setup Password
    // If user is NOT logged in, kick them to Login
    if ((path.startsWith('/dashboard') || path.startsWith('/auth/setup-password')) && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // PUBLIC ROUTES: Login & Register
    // If user IS logged in, kick them to Dashboard (unless they are finishing setup)
    if ((path === '/login' || path === '/register') && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    // Update matcher to include auth routes but exclude callback (handled separately)
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register',
        '/auth/setup-password'
    ],
};