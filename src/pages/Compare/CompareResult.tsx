import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Calculate as CalculateIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Apartment } from '../../types';
import { apartmentService } from '../../services/apartmentService';
import { useAuth } from '../../hooks/useAuth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ComparisonRow {
  label: string;
  values: (string | number)[];
  highlight?: boolean;
}

const CompareResult: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { selectedApartments } = location.state || {};
  
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entryValues, setEntryValues] = useState<number[]>([]);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [recalculateTrigger, setRecalculateTrigger] = useState(0);
  const [tableData, setTableData] = useState<ComparisonRow[]>([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  useEffect(() => {
    loadApartments();
  }, [selectedApartments]);

  useEffect(() => {
    if (apartments.length > 0) {
      const initialEntryValues = new Array(apartments.length).fill(50000);
      setEntryValues(initialEntryValues);
    }
  }, [apartments]);

  // Atualizar tabela quando apartments ou entryValues mudarem
  useEffect(() => {
    if (apartments.length > 0 && entryValues.length > 0) {
      const newTableData = generateComparisonData();
      setTableData(newTableData);
    }
  }, [apartments, entryValues]);

  // Força recálculo quando o botão de recalcular for clicado
  useEffect(() => {
    if (recalculateTrigger > 0 && apartments.length > 0 && entryValues.length > 0) {
      const newTableData = generateComparisonData();
      setTableData(newTableData);
    }
  }, [recalculateTrigger]);

  const loadApartments = async () => {
    try {
      setLoading(true);
      const apartmentsData = await Promise.all(
        selectedApartments.map((id: string) => apartmentService.getApartmentById(id))
      );
      setApartments(apartmentsData.filter((apt): apt is Apartment => apt !== null));
    } catch (err) {
              setError('Erro ao carregar dados dos imóveis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateFinancing = (apartmentPrice: number, entryValue: number) => {
    const totalEntryRequired = apartmentPrice * 0.2;
    const remainingEntry = totalEntryRequired - entryValue;
    
    if (remainingEntry < 0) return null;
    
    const rentPayment = apartmentPrice * 0.006;
    const entryPaymentMonthly = (remainingEntry * 1.1) / 36;
    const total = rentPayment + entryPaymentMonthly;
    
    return {
      rent: rentPayment,
      entryPayment: entryPaymentMonthly,
      total: total,
    };
  };

  // Calcular entrada mínima aMORA (5% ou R$10.000, o que for maior)
  const calculateAmoraEntry = (apartmentPrice: number) => {
    const fivePercentEntry = apartmentPrice * 0.05;
    return fivePercentEntry < 10000 ? 10000 : fivePercentEntry;
  };

  const generateComparisonData = (): ComparisonRow[] => {
    if (apartments.length === 0 || entryValues.length === 0) return [];

    // Garantir que temos valores válidos
    const currentEntryValues = entryValues.length > 0 ? entryValues : new Array(apartments.length).fill(50000);

    return [
      {
        label: 'Título',
        values: apartments.map(apt => apt.title),
        highlight: true,
      },
      {
        label: 'Preço',
        values: apartments.map(apt => formatCurrency(apt.price)),
        highlight: true,
      },
      {
        label: 'Localização',
        values: apartments.map(apt => `${apt.neighborhood}, ${apt.city}`),
      },
      {
        label: 'Área (m²)',
        values: apartments.map(apt => `${apt.area}m²`),
      },
      {
        label: 'Quartos',
        values: apartments.map(apt => apt.bedrooms),
      },
      {
        label: 'Banheiros',
        values: apartments.map(apt => apt.bathrooms),
      },
      {
        label: 'Vagas de Garagem',
        values: apartments.map(apt => apt.parkingSpaces),
      },
      {
        label: 'Condomínio',
        values: apartments.map(apt => apt.condominiumFee > 0 ? formatCurrency(apt.condominiumFee) : 'Não informado'),
      },
      {
        label: 'IPTU',
        values: apartments.map(apt => apt.iptu > 0 ? formatCurrency(apt.iptu) : 'Não informado'),
      },
      {
        label: 'Visibilidade',
        values: apartments.map(apt => apt.isPublic ? 'Público' : 'Privado'),
      },
      {
        label: 'Data de Criação',
        values: apartments.map(apt => new Date(apt.createdAt).toLocaleDateString('pt-BR')),
      },
      // Seção de Financiamento
      {
        label: 'FINANCIAMENTO aMORA',
        values: apartments.map(() => ''),
        highlight: true,
      },
      {
        label: 'Entrada Tradicional (20%)',
        values: apartments.map(apt => formatCurrency(apt.price * 0.2)),
      },
      {
        label: 'Entrada aMORA (5% ou R$10.000)',
        values: apartments.map(apt => formatCurrency(calculateAmoraEntry(apt.price))),
      },
      {
        label: 'Economia na Entrada',
        values: apartments.map(apt => formatCurrency((apt.price * 0.2) - calculateAmoraEntry(apt.price))),
      },
      {
        label: 'Parcela de Aluguel (0,6%)',
        values: apartments.map(apt => formatCurrency(apt.price * 0.006)),
      },
      {
        label: 'Parcela de Entrada (36x)',
        values: apartments.map(apt => {
          const amoraEntry = calculateAmoraEntry(apt.price);
          const remaining = (apt.price * 0.2) - amoraEntry;
          if (remaining <= 0) return 'R$ 0,00';
          return formatCurrency((remaining * 1.1) / 36);
        }),
      },
      {
        label: 'MENSALIDADE TOTAL aMORA',
        values: apartments.map(apt => {
          const amoraEntry = calculateAmoraEntry(apt.price);
          const financing = calculateFinancing(apt.price, amoraEntry);
          return financing ? formatCurrency(financing.total) : 'Entrada insuficiente';
        }),
        highlight: true,
      },
    ];
  };

  const handleEntryChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newEntryValues = [...entryValues];
    newEntryValues[index] = numValue;
    setEntryValues(newEntryValues);
    // Força o recálculo automático
    setRecalculateTrigger(prev => prev + 1);
  };

  const handleRecalculate = () => {
    setRecalculateTrigger(prev => prev + 1);
  };

  const handleBack = () => {
    navigate('/compare');
  };

  const handleNewComparison = () => {
    navigate('/compare');
  };

  const handleExportPDF = () => {
    if (apartments.length === 0) return;

    setExportingPDF(true);

    // Pequeno delay para mostrar o loading
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Configurações do PDF
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Título principal
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('Comparação de Imóveis - aMORA', margin, 30);
      
      // Data da comparação
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`, margin, 40);
      
      let yPosition = 60;
      
      // Informações dos imóveis
      apartments.forEach((apartment, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Imóvel ${index + 1}: ${apartment.title}`, margin, yPosition);
        
        yPosition += 10;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`${apartment.neighborhood}, ${apartment.city}`, margin, yPosition);
        
        yPosition += 8;
        doc.setTextColor(0, 0, 0);
        doc.text(`Preço: ${formatCurrency(apartment.price)}`, margin, yPosition);
        
        yPosition += 8;
        doc.text(`Área: ${apartment.area}m2 | Quartos: ${apartment.bedrooms} | Banheiros: ${apartment.bathrooms}`, margin, yPosition);
        
        yPosition += 15;
      });
      
      // Tabela comparativa
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Tabela Comparativa', margin, yPosition);
      yPosition += 20;
      
      // Preparar dados da tabela
      const pdfTableData = tableData.map(row => [
        row.label,
        ...row.values.map(value => String(value))
      ]);
      
      // Cabeçalho da tabela
      const headers = ['Característica', ...apartments.map((_, index) => `Imóvel ${index + 1}`)];
      
      // Configurações da tabela
      autoTable(doc, {
        head: [headers],
        body: pdfTableData,
        startY: yPosition,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [76, 175, 80], // Verde aMORA
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
        },
        didParseCell: function(data) {
          // Destacar linhas importantes
          if (data.row.index === 0 || data.row.index === 1 || 
              data.row.index === pdfTableData.length - 1 || 
              data.row.index === pdfTableData.length - 2) {
            data.cell.styles.fillColor = [255, 235, 59]; // Amarelo para destaque
            data.cell.styles.textColor = [0, 0, 0];
          }
        },
      });
      
      // Resumo final
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      if (finalY > 250) {
        doc.addPage();
        yPosition = 30;
      } else {
        yPosition = finalY;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumo Financeiro', margin, yPosition);
      yPosition += 15;
      
      apartments.forEach((apartment, index) => {
        const financing = calculateFinancing(apartment.price, entryValues[index]);
        if (financing) {
          doc.setFontSize(10);
          doc.text(`Imóvel ${index + 1}: ${formatCurrency(financing.total)}/mês`, margin, yPosition);
          yPosition += 8;
        }
      });
      
      // Rodapé
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin - 30, doc.internal.pageSize.getHeight() - 10);
        doc.text('aMORA - Sistema de Gestão Imobiliária', margin, doc.internal.pageSize.getHeight() - 10);
      }
      
      // Salvar o PDF
      doc.save(`comparacao-imoveis-amora-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setExportingPDF(false);
    }, 100);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={handleBack}>
          Voltar
        </Button>
      </Container>
    );
  }

  // Usar tableData em vez de gerar novamente

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.secondary.main,
            mb: 2,
          }}
        >
          Comparação de Imóveis
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Compare características, preços e financiamento dos imóveis selecionados
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleNewComparison}
          >
            Nova Comparação
          </Button>
          <Button
            variant="outlined"
            startIcon={exportingPDF ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={handleExportPDF}
            disabled={apartments.length === 0 || exportingPDF}
          >
            {exportingPDF ? 'Gerando PDF...' : 'Exportar PDF'}
          </Button>
        </Box>
      </Box>

      {/* Simule a mensalidade aMORA */}
      <Card sx={{ 
        mb: 4,
        background: `linear-gradient(135deg, rgba(4, 20, 76, 0.85) 0%, rgba(26, 43, 107, 0.85) 100%)`,
        boxShadow: '0 8px 32px rgba(4, 20, 76, 0.3)',
        border: '2px solid rgba(4, 20, 76, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalculateIcon sx={{ fontSize: 28, color: 'white' }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Simule a mensalidade aMORA
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={() => setInfoDialogOpen(true)}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Como funciona
            </Button>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            Compare as opções de entrada e descubra como a aMORA pode tornar sua conquista imobiliária mais acessível.
          </Typography>

          <Grid container spacing={3}>
            {apartments.map((apartment, index) => {
              const traditionalEntry = apartment.price * 0.2;
              const amoraEntry = calculateAmoraEntry(apartment.price);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={apartment.id}>
                  <Paper sx={{ 
                    p: 3, 
                    height: '100%',
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Box sx={{ 
                      height: '80px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 3
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        lineHeight: 1.2
                      }}>
                        {apartment.title}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Entrada Tradicional */}
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: '#ffebee', 
                        borderRadius: 2, 
                        border: '2px solid #f44336',
                        height: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PaymentIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                            Entrada Tradicional
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 700, 
                          color: '#d32f2f',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          mb: 0.5
                        }}>
                          {formatCurrency(traditionalEntry)}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#d32f2f', 
                          display: 'block', 
                          textAlign: 'center',
                          fontWeight: 500
                        }}>
                          (20% do valor do imóvel)
                        </Typography>
                      </Box>

                      {/* Entrada aMORA */}
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: '#e8f5e8', 
                        borderRadius: 2, 
                        border: '2px solid #4caf50',
                        height: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <TrendingUpIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                            Entrada aMORA
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 700, 
                          color: '#2e7d32',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          mb: 0.5
                        }}>
                          {formatCurrency(amoraEntry)}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: '#2e7d32', 
                          display: 'block', 
                          textAlign: 'center',
                          fontWeight: 500
                        }}>
                          (5% ou R$ 10.000, o que for maior)
                        </Typography>
                      </Box>

                      {/* Economia */}
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: '#fff3e0', 
                        borderRadius: 2, 
                        border: '2px solid #ff9800',
                        height: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 600, 
                          color: '#e65100',
                          textAlign: 'center',
                          mb: 1
                        }}>
                          Você economiza
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#e65100',
                          textAlign: 'center'
                        }}>
                          {formatCurrency(traditionalEntry - amoraEntry)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>


        </CardContent>
      </Card>

      {/* Tabela Comparativa */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.grey[50] }}>
                Característica
              </TableCell>
              {apartments.map((apartment, index) => (
                                  <TableCell 
                    key={apartment.id}
                    sx={{ 
                      fontWeight: 600, 
                      bgcolor: theme.palette.grey[50],
                      textAlign: 'center',
                    }}
                  >
                    Imóvel {index + 1}
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                sx={{
                  bgcolor: row.highlight ? theme.palette.primary.main + '10' : 'inherit',
                }}
              >
                <TableCell 
                  sx={{ 
                    fontWeight: row.highlight ? 600 : 400,
                    color: row.highlight ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {row.label}
                </TableCell>
                {row.values.map((value, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    sx={{ 
                      textAlign: 'center',
                      fontWeight: row.highlight ? 600 : 400,
                      color: row.highlight ? theme.palette.primary.main : 'inherit',
                    }}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumo */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Resumo da Comparação
          </Typography>
          <Grid container spacing={2}>
            {apartments.map((apartment, index) => {
              const amoraEntry = calculateAmoraEntry(apartment.price);
              const financing = calculateFinancing(apartment.price, amoraEntry);
              const traditionalEntry = apartment.price * 0.2;
              
              return (
                <Grid item xs={12} md={4} key={apartment.id}>
                  <Box sx={{ 
                    p: 3, 
                    border: `2px solid ${theme.palette.divider}`, 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.secondary.main }}>
                      {apartment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {apartment.neighborhood}, {apartment.city}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                      {formatCurrency(apartment.price)}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#d32f2f' }}>
                        Entrada Tradicional: {formatCurrency(traditionalEntry)}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#2e7d32' }}>
                        Entrada aMORA: {formatCurrency(amoraEntry)}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e65100' }}>
                        Economia: {formatCurrency(traditionalEntry - amoraEntry)}
                      </Typography>
                    </Box>
                    
                    {financing && (
                      <Chip
                        label={`Mensalidade aMORA: ${formatCurrency(financing.total)}`}
                        color="secondary"
                        size="medium"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          py: 1
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Diálogo de informações sobre a aMORA */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.secondary.main, 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <HomeIcon />
          Como funciona a aMORA
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main, fontWeight: 600 }}>
            Transformando sonhos em realidade imobiliária
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
              🏠 O que é a aMORA?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
              A aMORA é uma solução inovadora que compra o imóvel para você e permite que você realize seu sonho da casa própria com uma entrada muito menor.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
              💰 Como funciona o financiamento?
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Entrada reduzida:</strong> Apenas 5% do valor do imóvel (mínimo R$ 10.000)
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Aluguel durante 3 anos:</strong> Você paga um aluguel de 0,6% do valor do imóvel por mês
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Parcela da entrada:</strong> O restante da entrada tradicional (15%) é parcelado em 36 meses
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Financiamento próprio:</strong> Após 3 anos, você pode financiar o imóvel com bancos tradicionais
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
              ✅ Vantagens da aMORA
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Entrada muito menor:</strong> Economia de até 75% na entrada inicial
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Flexibilidade:</strong> Você pode morar no imóvel ou alugá-lo
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Segurança:</strong> O imóvel fica em seu nome desde o início
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                <strong>Transparência:</strong> Sem taxas ocultas ou surpresas
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2, bgcolor: theme.palette.primary.light, borderRadius: 2 }}>
            <Typography variant="body1" sx={{ 
              textAlign: 'center', 
              fontWeight: 600,
              color: theme.palette.primary.contrastText
            }}>
              💡 Dica: Use a calculadora acima para simular diferentes cenários e encontrar a melhor opção para você!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
          <Button 
            onClick={() => setInfoDialogOpen(false)}
            variant="contained"
            sx={{
              bgcolor: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: theme.palette.secondary.dark,
              }
            }}
          >
            Entendi!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompareResult;
