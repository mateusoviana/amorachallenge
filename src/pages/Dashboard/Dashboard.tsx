import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useUserApartments } from '../../hooks/useUserApartments';
import { DashboardStats, NeighborhoodStats, NeighborhoodPriceStats, PriceRangeStats, MonthlyGrowthStats } from '../../types';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { userApartments, loading } = useUserApartments();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Cores para os gráficos
  const COLORS = [
    '#fc94fc', // Rosa aMORA
    '#04144c', // Azul escuro
    '#4caf50', // Verde
    '#ff9800', // Laranja
    '#9c27b0', // Roxo
    '#2196f3', // Azul
    '#f44336', // Vermelho
    '#00bcd4', // Ciano
  ];

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Função para formatar tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          bgcolor: 'white',
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  useEffect(() => {
    if (userApartments.length > 0) {
      calculateStats();
    }
  }, [userApartments]);

  const calculateStats = () => {
    if (userApartments.length === 0) return;

    // Estatísticas por bairro
    const neighborhoodMap = new Map<string, number>();
    const neighborhoodPriceMap = new Map<string, { total: number; count: number; min: number; max: number }>();

    userApartments.forEach(apt => {
      // Contagem por bairro
      const current = neighborhoodMap.get(apt.neighborhood) || 0;
      neighborhoodMap.set(apt.neighborhood, current + 1);

      // Preços por bairro
      const priceData = neighborhoodPriceMap.get(apt.neighborhood) || { total: 0, count: 0, min: apt.price, max: apt.price };
      priceData.total += apt.price;
      priceData.count += 1;
      priceData.min = Math.min(priceData.min, apt.price);
      priceData.max = Math.max(priceData.max, apt.price);
      neighborhoodPriceMap.set(apt.neighborhood, priceData);
    });

    const apartmentsByNeighborhood: NeighborhoodStats[] = Array.from(neighborhoodMap.entries()).map(([neighborhood, count]) => ({
      neighborhood,
      count,
      percentage: (count / userApartments.length) * 100,
    }));

    const averagePriceByNeighborhood: NeighborhoodPriceStats[] = Array.from(neighborhoodPriceMap.entries()).map(([neighborhood, data]) => ({
      neighborhood,
      averagePrice: data.total / data.count,
      minPrice: data.min,
      maxPrice: data.max,
    }));

    // Faixas de preço
    const priceRanges = [
      { label: 'Até R$ 300k', min: 0, max: 300000 },
      { label: 'R$ 300k - 500k', min: 300000, max: 500000 },
      { label: 'R$ 500k - 800k', min: 500000, max: 800000 },
      { label: 'R$ 800k - 1M', min: 800000, max: 1000000 },
      { label: 'Acima de R$ 1M', min: 1000000, max: Infinity },
    ];

    const apartmentsByPriceRange: PriceRangeStats[] = priceRanges.map(range => {
      const count = userApartments.filter(apt => apt.price >= range.min && apt.price < range.max).length;
      return {
        range: range.label,
        count,
        percentage: (count / userApartments.length) * 100,
      };
    });

    // Crescimento mensal (mock para demonstração)
    const monthlyGrowth: MonthlyGrowthStats[] = [
      { month: 'Jan', newApartments: 2, totalApartments: 2 },
      { month: 'Fev', newApartments: 1, totalApartments: 3 },
      { month: 'Mar', newApartments: 3, totalApartments: 6 },
      { month: 'Abr', newApartments: 0, totalApartments: 6 },
      { month: 'Mai', newApartments: 2, totalApartments: 8 },
      { month: 'Jun', newApartments: 1, totalApartments: 9 },
    ];

    setStats({
      totalApartments: userApartments.length,
      apartmentsByNeighborhood,
      averagePriceByNeighborhood,
      apartmentsByPriceRange,
      monthlyGrowth,
    });
  };

  if (!user || user.userType !== 'realtor') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Apenas corretores podem acessar o dashboard.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dashboard...
        </Typography>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Nenhum imóvel encontrado para gerar estatísticas.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 2 }}>
            Dashboard de Imóveis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análise completa do seu portfólio imobiliário
          </Typography>
        </Box>

                 {/* Cards de resumo */}
         <Grid container spacing={3} sx={{ mb: 4 }}>
           <Grid item xs={12} sm={6} md={4}>
             <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
               <CardContent>
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <Box>
                     <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                       {stats.totalApartments}
                     </Typography>
                     <Typography variant="body2">
                       Total de Imóveis
                     </Typography>
                   </Box>
                   <HomeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                 </Box>
               </CardContent>
             </Card>
           </Grid>

           <Grid item xs={12} sm={6} md={4}>
             <Card sx={{ bgcolor: theme.palette.success.main, color: 'white' }}>
               <CardContent>
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <Box>
                     <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                       R$ {(userApartments.reduce((sum, apt) => sum + apt.price, 0) / 1000000).toFixed(1)}M
                     </Typography>
                     <Typography variant="body2">
                       Valor Total
                     </Typography>
                   </Box>
                   <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                 </Box>
               </CardContent>
             </Card>
           </Grid>

           <Grid item xs={12} sm={6} md={4}>
             <Card sx={{ bgcolor: theme.palette.info.main, color: 'white' }}>
               <CardContent>
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <Box>
                     <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                       R$ {(userApartments.reduce((sum, apt) => sum + apt.price, 0) / userApartments.length / 1000).toFixed(0)}k
                     </Typography>
                     <Typography variant="body2">
                       Preço Médio
                     </Typography>
                   </Box>
                   <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                 </Box>
               </CardContent>
             </Card>
           </Grid>
         </Grid>

        <Divider sx={{ my: 4 }} />



        <Divider sx={{ my: 4 }} />

        {/* Gráfico de Barras - Preços por Bairro */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChartIcon />
          Preços por Bairro
        </Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.averagePriceByNeighborhood}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="neighborhood" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value: number) => [formatCurrency(value), 'Preço Médio']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="averagePrice" 
                    fill={theme.palette.primary.main}
                    name="Preço Médio"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* Gráfico de Pizza - Faixas de Preço */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PieChartIcon />
          Distribuição por Faixa de Preço
        </Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.apartmentsByPriceRange}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percentage }) => `${range} (${percentage.toFixed(1)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.apartmentsByPriceRange.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* Gráfico de Linha - Crescimento Mensal */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShowChartIcon />
          Crescimento Mensal
        </Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.monthlyGrowth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="newApartments" 
                    stroke={theme.palette.success.main} 
                    strokeWidth={3}
                    name="Novos Imóveis"
                    dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalApartments" 
                    stroke={theme.palette.primary.main} 
                    strokeWidth={2}
                    name="Total de Imóveis"
                    dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Nota sobre funcionalidades */}
        <Box sx={{ mt: 6, p: 3, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <strong>Funcionalidades disponíveis:</strong> Gráficos interativos com tooltips, 
            visualização por pizza e barras, análise de crescimento temporal. 
            <br />
            <strong>Próximas funcionalidades:</strong> Filtros avançados, 
            exportação de relatórios e análises comparativas entre períodos.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
