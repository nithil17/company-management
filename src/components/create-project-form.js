"use client"


import { useState } from "react"

import { useRouter } from "next/navigation";



function CreateProjectForm({ organizationId }) {

    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true)
        setError("")

        try {

            const formData = new FormData(event.currentTarget);
            const name = formData.get("name");
            const description = formData.get("description");

            const response = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
                , body: JSON.stringify({
                    name: name,
                    description: description,
                    organizationId: organizationId
                })
            })

            const data = await response.json()

            console.log({ data })

            if (!response.ok) {

                setError(data.error || "Failed to Create Project")

                return;
            }

            setSuccess("Project created successfully!")
            router.refresh()
            setIsOpen(false)

        } catch (error) {
            setError("Something went wrong. Please try again.")
            console.error(err)
        }

        finally {
            setIsSubmitting(false)
        }

    }



    return (
        <div>
            {success && (
                <p className="mb-4 rounded-lg border border-green-800 bg-green-950 p-3 text-sm text-green-300" role="status">
                    {success}
                </p>
            )}
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                + New Project
            </button>
            <div className="mt-4 text-gray-300">
                {isOpen &&
                    <form
                        onSubmit={handleSubmit}
                        className="mt-4 space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">

                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                            Project Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white" />

                        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-300">
                            Description</label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your project"
                            rows={3}
                            className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white" />

                        {error && (
                            <p className="text-sm text-red-400" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </button>

                    </form>
                }

            </div>
        </div>
    )
}



export default CreateProjectForm