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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Calculate as CalculateIcon,
  Download as DownloadIcon,
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

  useEffect(() => {
    loadApartments();
  }, [selectedApartments]);

  useEffect(() => {
    if (apartments.length > 0) {
      setEntryValues(new Array(apartments.length).fill(50000));
    }
  }, [apartments]);

  const loadApartments = async () => {
    try {
      setLoading(true);
      const apartmentsData = await Promise.all(
        selectedApartments.map((id: string) => apartmentService.getApartmentById(id))
      );
      setApartments(apartmentsData.filter((apt): apt is Apartment => apt !== null));
    } catch (err) {
              setError('Erro ao carregar dados dos imoveis');
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

  const generateComparisonData = (): ComparisonRow[] => {
    if (apartments.length === 0) return [];

    return [
      {
        label: 'Titulo',
        values: apartments.map(apt => apt.title),
        highlight: true,
      },
      {
        label: 'Preco',
        values: apartments.map(apt => formatCurrency(apt.price)),
        highlight: true,
      },
      {
        label: 'Localizacao',
        values: apartments.map(apt => `${apt.neighborhood}, ${apt.city}`),
      },
      {
        label: 'Area (m2)',
        values: apartments.map(apt => `${apt.area}m2`),
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
        label: 'Condominio',
        values: apartments.map(apt => apt.condominiumFee > 0 ? formatCurrency(apt.condominiumFee) : 'Nao informado'),
      },
      {
        label: 'IPTU',
        values: apartments.map(apt => apt.iptu > 0 ? formatCurrency(apt.iptu) : 'Nao informado'),
      },
      {
        label: 'Visibilidade',
        values: apartments.map(apt => apt.isPublic ? 'Publico' : 'Privado'),
      },
      {
        label: 'Data de Criacao',
        values: apartments.map(apt => new Date(apt.createdAt).toLocaleDateString('pt-BR')),
      },
      // Seção de Financiamento
      {
        label: 'FINANCIAMENTO aMORA',
        values: apartments.map(() => ''),
        highlight: true,
      },
      {
        label: 'Entrada Inicial',
        values: entryValues.map(value => formatCurrency(value)),
      },
      {
        label: 'Entrada Total Necessaria (20%)',
        values: apartments.map(apt => formatCurrency(apt.price * 0.2)),
      },
      {
        label: 'Entrada Restante',
        values: apartments.map((apt, index) => {
          const remaining = (apt.price * 0.2) - entryValues[index];
          return remaining > 0 ? formatCurrency(remaining) : 'Entrada completa';
        }),
      },
      {
        label: 'Parcela de Aluguel (0,6%)',
        values: apartments.map(apt => formatCurrency(apt.price * 0.006)),
      },
      {
        label: 'Parcela de Entrada (36x)',
        values: apartments.map((apt, index) => {
          const remaining = (apt.price * 0.2) - entryValues[index];
          if (remaining <= 0) return 'R$ 0,00';
          return formatCurrency((remaining * 1.1) / 36);
        }),
      },
      {
        label: 'MENSALIDADE TOTAL',
        values: apartments.map((apt, index) => {
          const financing = calculateFinancing(apt.price, entryValues[index]);
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
      doc.text('Comparacao de Imoveis - aMORA', margin, 30);
      
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
        doc.text(`Imovel ${index + 1}: ${apartment.title}`, margin, yPosition);
        
        yPosition += 10;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`${apartment.neighborhood}, ${apartment.city}`, margin, yPosition);
        
        yPosition += 8;
        doc.setTextColor(0, 0, 0);
        doc.text(`Preco: ${formatCurrency(apartment.price)}`, margin, yPosition);
        
        yPosition += 8;
        doc.text(`Area: ${apartment.area}m2 | Quartos: ${apartment.bedrooms} | Banheiros: ${apartment.bathrooms}`, margin, yPosition);
        
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
      const tableData = comparisonData.map(row => [
        row.label,
        ...row.values.map(value => String(value))
      ]);
      
      // Cabeçalho da tabela
      const headers = ['Caracteristica', ...apartments.map((_, index) => `Imovel ${index + 1}`)];
      
      // Configurações da tabela
      autoTable(doc, {
        head: [headers],
        body: tableData,
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
              data.row.index === comparisonData.length - 1 || 
              data.row.index === comparisonData.length - 2) {
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
          doc.text(`Imovel ${index + 1}: ${formatCurrency(financing.total)}/mes`, margin, yPosition);
          yPosition += 8;
        }
      });
      
      // Rodapé
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Pagina ${i} de ${pageCount}`, pageWidth - margin - 30, doc.internal.pageSize.getHeight() - 10);
        doc.text('aMORA - Sistema de Gestao Imobiliaria', margin, doc.internal.pageSize.getHeight() - 10);
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

  const comparisonData = generateComparisonData();

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
          Comparacao de Imoveis
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
                      Compare caracteristicas, precos e financiamento dos imoveis selecionados
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleNewComparison}
          >
            Nova Comparacao
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

                  {/* Configuracao de Entrada */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateIcon />
            Configurar Entrada Inicial
          </Typography>
          <Grid container spacing={2}>
            {apartments.map((apartment, index) => (
              <Grid item xs={12} md={4} key={apartment.id}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {apartment.title}
                </Typography>
                <TextField
                  fullWidth
                  label="Entrada Inicial (R$)"
                  type="number"
                  value={entryValues[index]}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  InputProps={{
                    startAdornment: <Typography variant="caption">R$</Typography>,
                  }}
                  helperText={`20% necessario: ${formatCurrency(apartment.price * 0.2)}`}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela Comparativa */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.grey[50] }}>
                Caracteristica
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
                  Imovel {index + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonData.map((row, rowIndex) => (
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
            Resumo da Comparacao
          </Typography>
          <Grid container spacing={2}>
            {apartments.map((apartment, index) => {
              const financing = calculateFinancing(apartment.price, entryValues[index]);
              return (
                <Grid item xs={12} md={4} key={apartment.id}>
                  <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {apartment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {apartment.neighborhood}, {apartment.city}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      {formatCurrency(apartment.price)}
                    </Typography>
                    {financing && (
                      <Chip
                        label={`Mensalidade: ${formatCurrency(financing.total)}`}
                        color="secondary"
                        size="small"
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CompareResult;
