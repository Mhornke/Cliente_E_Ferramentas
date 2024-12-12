"use client";
import React, { createContext, useContext, useState } from "react";

// Define a interface para o contexto
interface CarrinhoContextType {
  isCarrinhoAberto: boolean;
  itens: any[]; // Troque `any` pela estrutura correta do seu item
  abrirCarrinho: () => void;
  fecharCarrinho: () => void;
}

// Cria o contexto
const CarrinhoContext = createContext<CarrinhoContextType | undefined>(
  undefined
);

// Componente Provider
export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [isCarrinhoAberto, setIsCarrinhoAberto] = useState(false);
  const [itens, setItens] = useState<any[]>([]); // Inicia com uma lista vazia

  const abrirCarrinho = () => setIsCarrinhoAberto(true);
  const fecharCarrinho = () => setIsCarrinhoAberto(false);

  return (
    <CarrinhoContext.Provider
      value={{ isCarrinhoAberto, itens, abrirCarrinho, fecharCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

// Hook para consumir o contexto
export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro do CarrinhoProvider");
  }
  return context;
}
