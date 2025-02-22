import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getToken() {
    const rawToken = (await cookies()).get(process.env.NODE_ENV === 'production' 
                                    ? '__Secure-next-auth.session-token'
                                    : 'next-auth.session-token');
    const token = await decode({
      token: rawToken?.value,
      secret: process.env.NEXTAUTH_SECRET as string,
    });
    return token;
}