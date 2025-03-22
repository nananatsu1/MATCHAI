import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addUser } from './utils/supabaseFunction';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 既にIDが存在する場合
  const existId = request.cookies.get("id");
  if (existId) {
    response.cookies.set({
      name: 'id',
      value: existId.value,
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }); // 有効期限30日
    return response;
  }

  // IDがない場合、新規ユーザーを作成
  const userId = await addUser("Guest");
  console.log("Generated User ID:", userId);

  response.cookies.set({
    name: 'id',
    value: userId,
    path: '/',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }); // 有効期限30日

  if (pathname === '/') {
    return response;
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/:path*'],
};
