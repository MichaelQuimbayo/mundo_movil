"use client";

import { useState } from "react";

export default function SearchModal() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    return (
        <>
            {/* Botón / buscador del navbar */}
            <button
                onClick={() => setOpen(true)}
                className="flex w-full max-w-lg items-center gap-3 rounded-lg border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-400 shadow-sm"
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                    />
                </svg>

                <span>Buscar productos...</span>

                <kbd className="ml-auto rounded border px-2 py-1 text-xs">
                    Ctrl K
                </kbd>
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="mx-auto mt-[10vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Buscador */}
                        <div className="flex items-center gap-3 border-b px-5 py-4">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                                />
                            </svg>

                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar celulares, accesorios y más..."
                                className="flex-1 outline-none text-sm"
                            />

                            <kbd className="rounded border px-2 py-1 text-xs text-gray-500">
                                ESC
                            </kbd>
                        </div>

                        {/* Resultados */}
                        <div className="min-h-40 p-4">
                            {query ? (
                                <div className="space-y-2">
                                    <p className="px-2 text-xs font-medium uppercase text-gray-400">
                                        Resultados
                                    </p>

                                    <button className="w-full rounded-lg px-3 py-3 text-left hover:bg-gray-50">
                                        <p className="text-sm font-medium">
                                            Samsung Galaxy S25
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Celulares · Samsung
                                        </p>
                                    </button>

                                    <button className="w-full rounded-lg px-3 py-3 text-left hover:bg-gray-50">
                                        <p className="text-sm font-medium">
                                            Samsung Galaxy A56
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Celulares · Samsung
                                        </p>
                                    </button>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-gray-400">
                                    Busca un producto para comenzar
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t px-5 py-3 text-xs text-gray-400">
                            Escribe para buscar productos
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}