import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
 
  if (tag) {
    revalidateTag(tag);
    return Response.json({ success:true, revalidated: true, now: Date.now() })
  }
 
  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing tag to revalidate',
  })
}

export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
 
  if (tag) {
    revalidateTag(tag);
    return Response.json({ success:true, revalidated: true, now: Date.now() })
  }
 
  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing tag to revalidate',
  })
}