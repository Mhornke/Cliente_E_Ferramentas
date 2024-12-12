"use client"
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { toast } from 'sonner'
import { CarrinhoI } from "@/utils/types/carrinho";

interface propsCarrinho {
    subTotal: number;
    frete: number;
    total: number;
}
export default function EnviaCompra({ subTotal, frete, total }: propsCarrinho) {
    const [carrinho, setCarrinho] = useState<CarrinhoI[]>([]);
    const { cliente } = useClienteStore();
    const { logaCliente } = useClienteStore();

    useEffect(() => {
        async function buscaCliente(idCliente: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`);
            if (response.status === 200) {
                const dados = await response.json();
                logaCliente(dados);
            }
        }

        async function buscaCarrinho(idCliente: string) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/carrinho/${idCliente}`);
            const dados = await response.json();
            setCarrinho(dados);
        }

        if (localStorage.getItem("client_key")) {
            const idClienteLocal = localStorage.getItem("client_key") as string;
            buscaCliente(idClienteLocal);
            buscaCarrinho(idClienteLocal);
        }
    }, [cliente.id, logaCliente]);

    // Função para enviar o pedido com todos os itens do carrinho
    async function enviaCompras() {
        const itensCarrinho = carrinho.map(item => ({
            id: item.id,
            nome: item.nome,
            ferramentaId: item.id,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
        }));

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clienteId: cliente.id,
                valorTotal: Number(total),
                quantidade: carrinho.reduce((acc, item) => acc + item.quantidade, 0), // Soma todas as quantidades
                descricao: "Pedido de compra",
                itens: itensCarrinho, // Passando os itens do carrinho
            }),
        });

        if (response.ok) {
            toast.success("Compra finalizada com sucesso!");
        } else {
            toast.error("Ocorreu um erro ao finalizar a compra.");
        }
    }

    return (
        <div>
            <button
                className="bg-orange-500 hover:bg-orange-700 text-white py-2 px-4 rounded"
                onClick={enviaCompras}  // Chama a função para enviar o pedido com todos os itens
            >
                Finalizar Compra
            </button>
        </div>
    );
}
