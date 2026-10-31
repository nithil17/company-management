import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col justify-center items-center text-center ">
      <div className="mx-auto max-w-3xl flex flex-col items-center ">
        <span
          className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          IT SERVICE & PROJECT MANAGEMENT.</span>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          WorkForge.
        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-gray-700">
          Your workspace, organized.
        </h2>

        <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">
          Manage your teams, projects, and tasks in one place.
        </p>

        <Link href="/signin"
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors">

          Get Started</Link>

      </div>
    </main>
  );

}
