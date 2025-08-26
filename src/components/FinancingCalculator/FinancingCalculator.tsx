import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Chip,
  TextField,
  Alert,
} from '@mui/material';
import { 
  Calculate as CalculateIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface FinancingCalculatorProps {
  apartmentPrice: number;
}

const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({ apartmentPrice }) => {
  const theme = useTheme();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [simulationDialogOpen, setSimulationDialogOpen] = useState(false);
  const [customEntry, setCustomEntry] = useState<number>(Math.max(apartmentPrice * 0.05, 10000));
  const [simulationError, setSimulationError] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcular valores
  const traditionalEntry = apartmentPrice * 0.2; // 20% entrada tradicional
  const fivePercentEntry = apartmentPrice * 0.05; // 5% do valor do imóvel
  const amoraEntry = fivePercentEntry >= 10000 ? fivePercentEntry : 10000; // 5% ou mínimo R$ 10.000
  const monthlyRent = apartmentPrice * 0.006; // 0,6% do valor do imóvel
  const remainingEntryMonthly = (traditionalEntry - amoraEntry) / 36; // Entrada restante dividida em 36 meses
  const totalMonthly = monthlyRent + remainingEntryMonthly;

  // Calcular valores da simulação
  const getSimulationValues = () => {
    const minEntry = fivePercentEntry >= 10000 ? fivePercentEntry : 10000;
    const validEntry = Math.max(customEntry, minEntry);
    const remainingEntrySimulation = (traditionalEntry - validEntry) / 36;
    const totalMonthlySimulation = monthlyRent + remainingEntrySimulation;
    
    return {
      entry: validEntry,
      remainingMonthly: remainingEntrySimulation,
      totalMonthly: totalMonthlySimulation,
      economy: traditionalEntry - validEntry
    };
  };

  const handleSimulationChange = (value: number) => {
    setCustomEntry(value);
    const minEntry = fivePercentEntry >= 10000 ? fivePercentEntry : 10000;
    
    if (value < minEntry) {
      if (fivePercentEntry >= 10000) {
        setSimulationError(`O valor mínimo de entrada é ${formatCurrency(fivePercentEntry)} (5% do valor do imóvel)`);
      } else {
        setSimulationError('O valor mínimo de entrada é R$ 10.000');
      }
    } else if (value > traditionalEntry) {
      setSimulationError('A entrada não pode ser maior que 20% do valor do imóvel');
    } else {
      setSimulationError('');
    }
  };

  const simulationValues = getSimulationValues();

  return (
    <>
      <Card sx={{ 
        mt: 3, 
        border: `2px solid ${theme.palette.primary.main}`,
        background: 'linear-gradient(135deg, #e8f0ff 0%, #d1e0ff 100%)',
        boxShadow: '0 8px 32px rgba(74, 20, 140, 0.25)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3 
          }}>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CalculateIcon sx={{ fontSize: 28 }} />
              Simule a mensalidade aMORA
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setSimulationDialogOpen(true)}
                size="small"
                sx={{ 
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.main,
                    color: 'white',
                  }
                }}
              >
                Simular
              </Button>
              <Button
                variant="outlined"
                startIcon={<InfoIcon />}
                onClick={() => setInfoDialogOpen(true)}
                size="small"
                sx={{ 
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                  }
                }}
              >
                Como funciona
              </Button>
            </Box>
          </Box>

          {/* Comparação de Entradas */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
              Compare as entradas necessárias
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {/* Entrada Tradicional */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                borderRadius: 2,
                border: '2px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
                position: 'relative'
              }}>
                <Chip 
                  label="TRADICIONAL" 
                  color="default" 
                  size="small" 
                  sx={{ mb: 1, fontWeight: 600 }}
                />
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: '#666',
                  mb: 1
                }}>
                  {formatCurrency(traditionalEntry)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  20% do valor do imóvel
                </Typography>
              </Box>

              {/* VS */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                px: 1
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.primary.main,
                  transform: 'rotate(90deg)',
                  fontSize: '1.2rem'
                }}>
                  VS
                </Typography>
              </Box>

              {/* Entrada aMORA */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                borderRadius: 2,
                border: `3px solid ${theme.palette.primary.main}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                textAlign: 'center',
                position: 'relative',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(74, 20, 140, 0.2)',
              }}>
                <Chip 
                  label="aMORA" 
                  color="primary" 
                  size="small" 
                  sx={{ mb: 1, fontWeight: 600 }}
                />
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.primary.main,
                  mb: 1
                }}>
                  {formatCurrency(amoraEntry)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {apartmentPrice * 0.05 >= 10000 ? '5% do valor do imóvel' : 'Mínimo de R$ 10.000'}
                </Typography>
              </Box>
            </Box>

            {/* Economia */}
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              backgroundColor: '#e8f5e8',
              border: '2px solid #4caf50'
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#2e7d32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                <TrendingUpIcon />
                Economia de {formatCurrency(traditionalEntry - amoraEntry)} na entrada!
              </Typography>
            </Box>
          </Box>

          {/* Mensalidade aMORA */}
          <Box sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: 'white',
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: '0 4px 16px rgba(74, 20, 140, 0.1)',
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PaymentIcon />
              Sua mensalidade aMORA (36 meses)
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Aluguel mensal:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(monthlyRent)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                + Parcela da entrada restante:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(remainingEntryMonthly)}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" fontWeight={700} color={theme.palette.primary.main}>
                Total mensal:
              </Typography>
              <Typography variant="h5" fontWeight={700} color={theme.palette.primary.main}>
                {formatCurrency(totalMonthly)}
              </Typography>
            </Box>
          </Box>

          {/* Informações adicionais */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2,
            backgroundColor: '#fff3e0',
            border: '1px solid #ff9800'
          }}>
            <Typography variant="body2" sx={{ 
              textAlign: 'center',
              color: '#e65100',
              fontWeight: 500
            }}>
              💡 Após 36 meses, você terá condições de financiar o imóvel com entrada reduzida!
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog de Simulação */}
      <Dialog 
        open={simulationDialogOpen} 
        onClose={() => setSimulationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: theme.palette.secondary.main,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EditIcon />
          Simular com entrada personalizada
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            Insira o valor da entrada que você pode dar e veja como ficaria sua mensalidade:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Valor da entrada"
              type="number"
              value={customEntry}
              onChange={(e) => handleSimulationChange(Number(e.target.value))}
              fullWidth
              size="medium"
              InputProps={{
                startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>R$</Typography>,
              }}
                             helperText={`Mínimo: ${fivePercentEntry >= 10000 ? formatCurrency(fivePercentEntry) : 'R$ 10.000'} | Máximo: ${formatCurrency(traditionalEntry)}`}
              error={!!simulationError}
              sx={{ mb: 2 }}
            />
            
            {simulationError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {simulationError}
              </Alert>
            )}
          </Box>

          {!simulationError && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main, fontWeight: 600 }}>
                Resultado da simulação:
              </Typography>
              
              <Box sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: '#f8f9ff',
                border: `2px solid ${theme.palette.secondary.main}`,
                mb: 3
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Sua entrada:
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color={theme.palette.secondary.main}>
                    {formatCurrency(simulationValues.entry)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Aluguel mensal:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatCurrency(monthlyRent)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    + Parcela da entrada restante:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatCurrency(simulationValues.remainingMonthly)}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} color={theme.palette.secondary.main}>
                    Total mensal:
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color={theme.palette.secondary.main}>
                    {formatCurrency(simulationValues.totalMonthly)}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#e8f5e8',
                  border: '1px solid #4caf50'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <TrendingUpIcon />
                    Economia de {formatCurrency(simulationValues.economy)} na entrada!
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSimulationDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => setSimulationDialogOpen(false)}
            variant="contained"
            disabled={!!simulationError}
            sx={{ 
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              }
            }}
          >
            Confirmar Simulação
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog com informações sobre como funciona a aMORA */}
      <Dialog 
        open={infoDialogOpen} 
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <HomeIcon />
          Como funciona a aMORA
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            A aMORA revoluciona a forma de adquirir imóveis, tornando o sonho da casa própria mais acessível:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
              🏠 O que a aMORA faz:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              • <strong>A aMORA compra o imóvel para você</strong> - você não precisa se preocupar com financiamento bancário
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              • <strong>Entrada reduzida de apenas 5%</strong> - muito menos que os 20% tradicionais dos bancos
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              • <strong>Mensalidade acessível</strong> - composta por aluguel + parcela da entrada restante
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
              ⏰ Processo de 3 anos:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              • <strong>Ano 1-3:</strong> Você paga a mensalidade aMORA (aluguel + entrada restante)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              • <strong>Ao final dos 3 anos:</strong> Você terá juntado dinheiro suficiente para dar entrada em um financiamento tradicional
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              • <strong>Resultado:</strong> Você consegue financiar o imóvel com condições muito melhores!
            </Typography>
          </Box>

          <Box sx={{ 
            p: 2, 
            borderRadius: 2,
            backgroundColor: '#e8f5e8',
            border: '1px solid #4caf50'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 1, 
              color: '#2e7d32',
              fontWeight: 600
            }}>
              🎯 Vantagens da aMORA:
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              • Entrada muito menor (5% vs 20%)<br/>
              • Não precisa de aprovação bancária inicial<br/>
              • Mensalidade mais acessível<br/>
              • Tempo para organizar as finanças<br/>
              • Possibilidade de comprar imóveis melhores
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setInfoDialogOpen(false)}
            variant="contained"
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Entendi!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FinancingCalculator;
