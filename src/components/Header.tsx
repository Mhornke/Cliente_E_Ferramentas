"use client";
import Link from "next/link";
import { useClienteStore } from "@/context/cliente";
import { useCarrinho } from "@/context/carrinho";
import { useRouter } from "next/navigation";
import Carrinho from "../app//compra/carrinho/page"; 
import Image from "next/image";
export function Header() {
  const { cliente, deslogaCliente } = useClienteStore();
  const router = useRouter();
  const { isCarrinhoAberto, abrirCarrinho, fecharCarrinho, itens } =
    useCarrinho();

  function sairCliente() {
    deslogaCliente();
    if (localStorage.getItem("client_key")) {
      localStorage.removeItem("client_key");
    }
    router.push("/login");
  }

  return (
    <nav className="bg-slate-50 border-gray-200 mb-15 relative">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="./logo.png" className="h-16" alt="logo" />
          <span className="self-center text-3xl font-semibold whitespace-nowrap">
            E-Ferramentas
          </span>
        </Link>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {cliente.id ? (
            <>
              
              <Link
                href="/favoritos"
                className="font-bold flex text-orange-600 hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>


                <span className="ml-2">Favoritos</span>
              </Link>

              <div
                className="font-bold flex cursor-pointer items-center text-orange-600 hover:underline"
                onClick={() => (isCarrinhoAberto ? fecharCarrinho() : abrirCarrinho())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 mb-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3.75h1.5l2.677 11.196a2.25 2.25 0 002.193 1.804h9.06a2.25 2.25 0 002.193-1.804l1.311-5.485H6.98"
                  />
                  <circle cx="9" cy="19.5" r="1.5" />
                  <circle cx="17" cy="19.5" r="1.5" />
                </svg>

                <span className="ml-1.5">Carrinho</span>

              </div>

              {isCarrinhoAberto && (
                <div className="absolute top-16 right-0 w-80 bg-white shadow-lg border p-4">
                  <Carrinho />
                </div>
              )}


              <Link
                href="/compra"
                className="font-bold flex text-orange-600 hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 8h14l-1.5 10.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8V6a5 5 0 0110 0v2"
                  />
                </svg>

                <span className="">Compras</span>
              </Link>

              <span
                className="cursor-pointer font-bold text-blue-600 hover:underline"
                onClick={sairCliente}
              >
                Sair
              </span>
              <span className="text-black">{cliente.nome}</span>
            </>
          ) : (
            <Link
              href="/login"
              className="font-bold text-blue-600 hover:underline"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
