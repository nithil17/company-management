
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "You must sign in first" },
        { status: 401 }
      );
    }

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: { organization: true }
    });

    return Response.json(memberships);
  } catch (error) {
    console.error("Fetch organizations error:", error);

    return Response.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
