import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Menu, X, Search as SearchIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import Image from "next/image";
import Search from "./Search";

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} className={`flex items-center text-base font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'}`}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  // El `Search.js` actual ya no necesita un trigger personalizado, así que lo simplificamos.
  // El componente `Search` ahora es internamente responsivo o se renderiza diferente.
  // Esta implementación asume que `Search.js` NO TIENE un custom trigger.
  // Volvemos a la versión de `Search.js` que se controla a sí misma.
  
  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-700">
        <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* --- Left Section --- */}
            <div className="flex items-center justify-start lg:flex-initial">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 rounded-md text-stone-500 lg:hidden">
                <Menu size={24} />
              </button>
              <div className="hidden lg:block">
                <Link href="/">
                  <Image src="/images/logo.png" alt="Mundo Móvil" width={1018} height={231} className="h-12 w-auto object-contain" priority/>
                </Link>
              </div>
            </div>

            {/* --- Center Section --- */}
            <div className="flex items-center justify-center flex-1">
              <div className="lg:hidden">
                <Link href="/">
                  <Image src="/images/logo.png" alt="Mundo Móvil" width={1018} height={231} className="h-10 w-auto object-contain" priority/>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center w-full max-w-2xl px-8">
                <Search />
              </div>
            </div>

            {/* --- Right Section --- */}
            <div className="flex items-center justify-end lg:flex-initial space-x-2">
              <div className="hidden lg:flex items-center space-x-6">
                <NavLink href="/register">Crea tu cuenta</NavLink>
                <NavLink href="/login">Ingresa</NavLink>
                <NavLink href="/orders">Mis compras</NavLink>
              </div>
              {/* El componente Search se encarga de su propia lógica de trigger */}
              <div className="lg:hidden">
                <Search />
              </div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-md text-stone-500">
                <ShoppingCart size={24}/>
                {totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">{totalItems}</span>}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-72 max-w-[calc(100%-3rem)] bg-stone-50 dark:bg-gray-800 h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <Image src="/images/logo.png" alt="Mundo Móvil" width={1018} height={231} className="h-10 w-auto object-contain" priority/>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 rounded-md"><X size={24} /></button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className={`text-lg font-medium ${router.pathname === '/' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Categorias</Link>
              <Link href="/shop" className={`text-lg font-medium ${router.asPath === '/shop' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Ofertas</Link>
              <div className="border-t border-stone-200 dark:border-stone-700 my-4"></div>
              <Link href="/register" className={`text-lg font-medium ${router.pathname === '/register' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Crea tu cuenta</Link>
              <Link href="/login" className={`text-lg font-medium ${router.pathname === '/login' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Ingresa</Link>
              <Link href="/orders" className={`text-lg font-medium ${router.pathname === '/orders' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Mis compras</Link>
            </nav>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
