'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search as SearchIcon } from 'lucide-react';

const SearchModal = ({ open, onClose, query, setQuery }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const modalContent = (
    <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
    >
        <div
            className="mx-auto mt-[10vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-stone-900"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-700 px-5 py-4">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar celulares, accesorios y más..."
                    className="flex-1 bg-transparent outline-none text-sm text-stone-900 dark:text-stone-100"
                />
                <button onClick={onClose} className="text-xs font-medium text-gray-500 dark:text-gray-400">ESC</button>
            </div>
            <div className="min-h-40 p-4">
                {query ? (
                    <div className="space-y-2">
                        <p className="px-2 text-xs font-medium uppercase text-gray-400">Resultados</p>
                        <button className="w-full rounded-lg px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-stone-800">
                            <p className="text-sm font-medium">Samsung Galaxy S25</p>
                            <p className="text-xs text-gray-500">Celulares · Samsung</p>
                        </button>
                    </div>
                ) : (
                    <div className="py-8 text-center text-sm text-gray-400">Busca un producto para comenzar</div>
                )}
            </div>
        </div>
    </div>
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!open || !isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default function Search() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    // Renderiza un botón diferente en móvil vs escritorio
    const trigger = (
      <button onClick={() => setOpen(true)} className="p-2 text-stone-500 lg:flex lg:w-full lg:max-w-lg lg:items-center lg:gap-3 lg:rounded-lg lg:border lg:border-gray-400 lg:bg-white lg:px-4 lg:py-2.5 lg:text-sm lg:text-gray-400 lg:shadow-sm lg:dark:bg-stone-800 lg:dark:border-stone-600">
          {/* Icono en móvil */}
          <div className="lg:hidden">
            <SearchIcon size={24} />
          </div>
          {/* Botón completo en escritorio */}
          <div className="hidden lg:flex items-center w-full">
            <SearchIcon className="h-5 w-5" />
            <span>Buscar productos...</span>
            <kbd className="ml-auto rounded border px-2 py-1 text-xs dark:border-stone-600">Ctrl K</kbd>
          </div>
        </button>
    );

    return (
      <>
        {trigger}
        <SearchModal open={open} onClose={() => setOpen(false)} query={query} setQuery={setQuery} />
      </>
    );
}
