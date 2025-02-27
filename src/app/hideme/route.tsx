// app/set-dnt/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Set the cookie "doNotTrack" to "true" for the entire site
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('doNotTrack', 'true', { path: '/' });
  return response;
}