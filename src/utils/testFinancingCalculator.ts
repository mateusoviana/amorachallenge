// Teste da calculadora de financiamento
export const testFinancingCalculator = () => {
  const apartmentPrice = 500000; // R$ 500.000
  const initialPayment = 100000; // R$ 100.000
  
  // Cálculos esperados
  const totalEntryRequired = apartmentPrice * 0.2; // 20% = R$ 100.000
  const remainingEntry = totalEntryRequired - initialPayment; // R$ 0
  const rentPayment = apartmentPrice * 0.006; // 0,6% = R$ 3.000
  const entryPaymentMonthly = (remainingEntry * 1.1) / 36; // R$ 0
  const total = rentPayment + entryPaymentMonthly; // R$ 3.000
  
  console.log('=== Teste da Calculadora de Financiamento ===');
  console.log(`Valor do imóvel: R$ ${apartmentPrice.toLocaleString('pt-BR')}`);
  console.log(`Entrada inicial: R$ ${initialPayment.toLocaleString('pt-BR')}`);
  console.log(`Entrada total necessária (20%): R$ ${totalEntryRequired.toLocaleString('pt-BR')}`);
  console.log(`Entrada restante: R$ ${remainingEntry.toLocaleString('pt-BR')}`);
  console.log(`Parcela do aluguel (0,6%): R$ ${rentPayment.toLocaleString('pt-BR')}`);
  console.log(`Parcela da entrada mensal: R$ ${entryPaymentMonthly.toLocaleString('pt-BR')}`);
  console.log(`Total mensal: R$ ${total.toLocaleString('pt-BR')}`);
  console.log('===========================================');
  
  return {
    apartmentPrice,
    initialPayment,
    totalEntryRequired,
    remainingEntry,
    rentPayment,
    entryPaymentMonthly,
    total
  };
};

// Teste com entrada menor
export const testFinancingCalculatorWithSmallerEntry = () => {
  const apartmentPrice = 500000; // R$ 500.000
  const initialPayment = 50000; // R$ 50.000
  
  // Cálculos esperados
  const totalEntryRequired = apartmentPrice * 0.2; // 20% = R$ 100.000
  const remainingEntry = totalEntryRequired - initialPayment; // R$ 50.000
  const rentPayment = apartmentPrice * 0.006; // 0,6% = R$ 3.000
  const entryPaymentMonthly = (remainingEntry * 1.1) / 36; // R$ 1.527,78
  const total = rentPayment + entryPaymentMonthly; // R$ 4.527,78
  
  console.log('=== Teste com Entrada Menor ===');
  console.log(`Valor do imóvel: R$ ${apartmentPrice.toLocaleString('pt-BR')}`);
  console.log(`Entrada inicial: R$ ${initialPayment.toLocaleString('pt-BR')}`);
  console.log(`Entrada total necessária (20%): R$ ${totalEntryRequired.toLocaleString('pt-BR')}`);
  console.log(`Entrada restante: R$ ${remainingEntry.toLocaleString('pt-BR')}`);
  console.log(`Parcela do aluguel (0,6%): R$ ${rentPayment.toLocaleString('pt-BR')}`);
  console.log(`Parcela da entrada mensal: R$ ${entryPaymentMonthly.toLocaleString('pt-BR')}`);
  console.log(`Total mensal: R$ ${total.toLocaleString('pt-BR')}`);
  console.log('================================');
  
  return {
    apartmentPrice,
    initialPayment,
    totalEntryRequired,
    remainingEntry,
    rentPayment,
    entryPaymentMonthly,
    total
  };
};
