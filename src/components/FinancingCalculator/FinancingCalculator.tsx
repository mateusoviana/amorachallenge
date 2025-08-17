import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';

interface FinancingCalculatorProps {
  apartmentPrice: number;
}

const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({ apartmentPrice }) => {
  const theme = useTheme();
  const [initialPayment, setInitialPayment] = useState<number>(50000);
  const [monthlyPayment, setMonthlyPayment] = useState<{
    rent: number;
    entryPayment: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateFinancing = useCallback(() => {
    // Validar entrada inicial
    if (initialPayment < 50000 || initialPayment > 200000) {
      setError('A entrada inicial deve ser entre R$ 50.000 e R$ 200.000');
      setMonthlyPayment(null);
      return;
    }

    // Calcular entrada total (20% do valor do imóvel)
    const totalEntryRequired = apartmentPrice * 0.2;
    
    // Calcular entrada restante
    const remainingEntry = totalEntryRequired - initialPayment;
    
    if (remainingEntry < 0) {
      setError('A entrada inicial não pode ser maior que 20% do valor do imóvel');
      setMonthlyPayment(null);
      return;
    }

    // Calcular parcelas
    const rentPayment = apartmentPrice * 0.006; // 0,6% do valor do imóvel
    const entryPaymentMonthly = (remainingEntry * 1.1) / 36; // Entrada restante * 1.1 / 36 meses
    
    const total = rentPayment + entryPaymentMonthly;

    setMonthlyPayment({
      rent: rentPayment,
      entryPayment: entryPaymentMonthly,
      total: total,
    });
    
    setError('');
  }, [apartmentPrice, initialPayment]);

  useEffect(() => {
    if (apartmentPrice > 0) {
      calculateFinancing();
    }
  }, [calculateFinancing, apartmentPrice]);

  return (
    <Card sx={{ mt: 2, border: `1px solid ${theme.palette.primary.main}` }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CalculateIcon />
          Parcelas mais acessíveis com a aMORA
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Valor do imóvel: {formatCurrency(apartmentPrice)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Entrada total necessária (20%): {formatCurrency(apartmentPrice * 0.2)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Entrada inicial"
            type="number"
            value={initialPayment}
            onChange={(e) => setInitialPayment(Number(e.target.value))}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>R$</Typography>,
            }}
            helperText="Mínimo: R$ 50.000 | Máximo: R$ 200.000"
            error={initialPayment < 50000 || initialPayment > 200000}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {monthlyPayment && !error && (
          <Box>
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Composição da mensalidade (36 meses):
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Parcela do aluguel:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatCurrency(monthlyPayment.rent)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Parcela da entrada:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatCurrency(monthlyPayment.entryPayment)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={600} color={theme.palette.primary.main}>
                Total mensal:
              </Typography>
              <Typography variant="h6" fontWeight={600} color={theme.palette.primary.main}>
                {formatCurrency(monthlyPayment.total)}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancingCalculator;
