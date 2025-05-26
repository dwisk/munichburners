import { AuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'MMB Ticket',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        ordernumber: { label: "Bestellnummer", type: "text", placeholder: "ABC123" },
        ticketcode: { label: "Ticket Code", type: "text", placeholder: "abcdm4uya6cggxyz" },
        // year: { label: "Jahr", type: "text" },
      },
      async authorize(credentials) {
        const res = await fetch(`https://tickets.germanburners.de/api/v1/organizers/munichburners/events/mmb2025/orders/${credentials?.ordernumber}`, {
          method: 'GET',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": "Token z7k6l8cze7sp42ptslo2tna3tderuqejw51li8t19lqojmkftrhr29zeqwmw6fiq"
          }
        })
        
        const userData = await res.json()

        // If no error and we have user data, return it
        if (res.status === 200 && userData && userData.status === 'p') {
          const position = userData.positions.find((p: PretixPosistion) => p.secret === credentials?.ticketcode)
          if (position) {
            return {
              id: position.id,
              name: position.attendee_name,
              email: position.secret
            }
          }
          return null
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ]
}

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }


type PretixPosistion = {
  id: number;
  attendee_name: string;
  secret: string;
}
