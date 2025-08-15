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
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useUserApartments } from '../../hooks/useUserApartments';
import { DashboardStats, NeighborhoodStats, NeighborhoodPriceStats, PriceRangeStats, MonthlyGrowthStats } from '../../types';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { userApartments, loading } = useUserApartments();
  const [stats, setStats] = useState<DashboardStats | null>(null);

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
          <Grid item xs={12} sm={6} md={3}>
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

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.secondary.main, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                      {stats.apartmentsByNeighborhood.length}
                    </Typography>
                    <Typography variant="body2">
                      Bairros Atendidos
                    </Typography>
                  </Box>
                  <LocationIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
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

          <Grid item xs={12} sm={6} md={3}>
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

        {/* Estatísticas por bairro */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
          Distribuição por Bairro
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.apartmentsByNeighborhood.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.neighborhood}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.neighborhood}
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    {item.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.percentage.toFixed(1)}% do total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Preços por bairro */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
          Preços por Bairro
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.averagePriceByNeighborhood.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.neighborhood}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.neighborhood}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                    R$ {(item.averagePrice / 1000).toFixed(0)}k
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block">
                      Mín: R$ {(item.minPrice / 1000).toFixed(0)}k
                    </Typography>
                    <Typography variant="caption" display="block">
                      Máx: R$ {(item.maxPrice / 1000).toFixed(0)}k
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Faixas de preço */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
          Distribuição por Faixa de Preço
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.apartmentsByPriceRange.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.range}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.range}
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    {item.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.percentage.toFixed(1)}% do total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Crescimento mensal */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
          Crescimento Mensal
        </Typography>
        <Grid container spacing={3}>
          {stats.monthlyGrowth.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.month}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.month}
                  </Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                    +{item.newApartments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {item.totalApartments}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Nota sobre gráficos */}
        <Box sx={{ mt: 6, p: 3, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <strong>Próximas funcionalidades:</strong> Gráficos interativos, filtros avançados, 
            exportação de relatórios e análises comparativas entre períodos.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
