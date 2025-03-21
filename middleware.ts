import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addUser } from './utils/supabaseFunction';

export function middleware(request: NextRequest) {

  const response = NextResponse.next();

  const fetchData = async () => {
    const userId = await addUser("Guest");
    response.cookies.set({
      name: 'id',
      value: userId.value,
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }); // 有効期限30日
    return NextResponse.redirect(new URL('/', request.url));
  };

  const existId = request.cookies.get("id");
  if (existId) {
    response.cookies.set({
      name: 'id',
      value: existId.value,
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }); // 有効期限30日
    return response;
  } else {
    fetchData();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/[room]/:path*'],
};
