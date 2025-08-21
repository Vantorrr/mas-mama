import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';

interface SessionData {
  isAdmin: boolean;
  email?: string;
}

export async function middleware(request: NextRequest) {
  // Проверяем только админские маршруты
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    try {
      const response = NextResponse.next();
      const session = await getIronSession<SessionData>(request, response, {
        password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
        cookieName: 'admin-session',
        cookieOptions: {
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        },
      });

      if (!session.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      return response;
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
