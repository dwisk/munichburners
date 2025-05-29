'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MMBLogin({className = ''}: {className?: string}) {
  const { data: session, status } = useSession();

  const path = usePathname();

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (session) {
    return (
      <Link href={`/api/auth/signout?callbackUrl=${path}`} className={`btn ${className}`}>
        Logout as {session.user?.name}
      </Link>
    );
  }

  return (
    <Link href={`/api/auth/signin?callbackUrl=${path}`} className={`btn btn-neutral ${className}`}>
      Mit MMB Ticket einloggen
    </Link>
  );
}