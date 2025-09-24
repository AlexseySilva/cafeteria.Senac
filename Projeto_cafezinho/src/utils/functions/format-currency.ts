export function formatCurrency(vaule: number) {
  return vaule.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
