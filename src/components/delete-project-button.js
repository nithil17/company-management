"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ projectId }) {

    const router = useRouter()
    const [error, setError] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)


    return (
        <div>
            <button
            className="mt-7 inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/40 active:scale-95"

            disabled={isDeleting}
                type="button"
                onClick={async () => {
                    const confirmed = window.confirm("Are you sure you want to delete this project?")
                    if (!confirmed) return;

                    try {
                        setIsDeleting(true)
                        const response = await fetch(`/api/projects/${projectId}`, {
                            method: "DELETE"
                        });

                        if (!response.ok) {
                            throw new Error("Failed to delete project")
                        }

                        router.refresh()
                    } catch (error) {
                        setError(error.message)
                    } finally {
                        setIsDeleting(false)
                    }


                }}
            >{isDeleting? "Deleting.....":"Delete"}</button>
            {error && <p>{error}</p>}


        </div>
    )

}