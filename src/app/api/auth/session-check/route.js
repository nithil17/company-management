import { auth } from "@/auth"

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return Response.json(
            { authenticated: false, message: "No Active Sessions" },
            { status: 401 }
        )
    }

    return Response.json(
        {
            authenticated: true,
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image
            }
        }
    )
}