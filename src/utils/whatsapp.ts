
export const generateWhatsAppLink = (productName: string, productPrice: number): string => {
  const phoneNumber = '5538999196878'; // Número atualizado conforme solicitado
  const message = `Olá! Tenho interesse na joia: *${productName}*. Gostaria de mais informações e saber o preço.`;
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};
