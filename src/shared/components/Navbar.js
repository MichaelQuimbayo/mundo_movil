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
    <Link href={href} className={`flex items-center text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'}`}>
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
  
  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-700">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* --- Left Section --- */}
            <div className="flex items-center justify-start lg:flex-initial">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 rounded-md text-stone-500 lg:hidden">
                <Menu size={22} />
              </button>
              <div className="hidden lg:block">
                <Link href="/">
                  <Image src="/images/logo.png" alt="Mundo Móvil" width={1018} height={231} className="h-8 w-auto object-contain" priority/>
                </Link>
              </div>
            </div>

            {/* --- Center Section --- */}
            <div className="flex items-center justify-center flex-1">
              <div className="lg:hidden">
                <Link href="/">
                  <Image src="/images/logo.png" alt="Mundo Móvil" width={1018} height={231} className="h-7 w-auto object-contain" priority/>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center w-full max-w-xl px-6">
                <Search />
              </div>
            </div>

            {/* --- Right Section --- */}
            <div className="flex items-center justify-end lg:flex-initial space-x-3">
              <div className="hidden lg:flex items-center space-x-5">
                <NavLink href="/register">Crea tu cuenta</NavLink>
                <NavLink href="/login">Ingresa</NavLink>
                <NavLink href="/orders">Mis compras</NavLink>
              </div>
              <div className="lg:hidden">
                <Search />
              </div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-md text-stone-600 hover:text-stone-900">
                <ShoppingCart size={22}/>
                {totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">{totalItems}</span>}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-72 max-w-[calc(100%-3rem)] bg-stone-50 dark:bg-gray-800 h-full p-6">
            <div className="flex justify-between items-center mb-6">
              <Image src="/images/logo.png" alt="Mundo Móvil" width={1018} height={231} className="h-7 w-auto object-contain" priority/>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 rounded-md"><X size={22} /></button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className={`text-base font-medium ${router.pathname === '/' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Categorias</Link>
              <Link href="/shop" className={`text-base font-medium ${router.asPath === '/shop' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Ofertas</Link>
              <div className="border-t border-stone-200 dark:border-stone-700 my-2"></div>
              <Link href="/register" className={`text-base font-medium ${router.pathname === '/register' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Crea tu cuenta</Link>
              <Link href="/login" className={`text-base font-medium ${router.pathname === '/login' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Ingresa</Link>
              <Link href="/orders" className={`text-base font-medium ${router.pathname === '/orders' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Mis compras</Link>
            </nav>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
