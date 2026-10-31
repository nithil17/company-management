
import { signIn, signOut } from "@/auth";

export default function SignInPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="rounded-xl bg-white p-8 text-center shadow-md">
                <h1 className="mb-2 text-2xl font-bold">
                    Welcome to WorkForge
                </h1>

                <p className="mb-6 text-gray-600">
                    Sign in to manage your projects and team.
                </p>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/" });
                    }}
                >
                    <button
                        type="submit"
                        className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
                    >
                        Continue with Google
                    </button>
                </form>

                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/signin" })
                    }}
                >
                    <button type="submit"
                        className="mt-4 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100">
                        Sign out
                    </button>
                </form>
            </div>
        </main>
    );
}
