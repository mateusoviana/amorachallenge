import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Button,
  TextField,
  Popover,
  IconButton,
  Drawer,
  Divider,
  Slider,
  useTheme,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Close as CloseIcon,
  Tune as TuneIcon,
  AttachMoney as MoneyIcon,
  Sort as SortIcon,
  Hotel as HotelIcon,
  DirectionsCar as CarIcon,
  KeyboardArrowDown as ArrowDownIcon,
  HomeWork as NeighborhoodIcon,
  LocationCity as CityIcon,
  Menu as MenuIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { FilterOptions, Group } from '../../types';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  groups: Group[];
  onClearFilters: () => void;
  isLoggedIn?: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  groups,
  onClearFilters,
  isLoggedIn = false,
}) => {
  const theme = useTheme();
  const [priceAnchorEl, setPriceAnchorEl] = useState<HTMLElement | null>(null);
  const [bedroomsAnchorEl, setBedroomsAnchorEl] = useState<HTMLElement | null>(null);
  const [groupsAnchorEl, setGroupsAnchorEl] = useState<HTMLElement | null>(null);
  const [neighborhoodAnchorEl, setNeighborhoodAnchorEl] = useState<HTMLElement | null>(null);
  const [cityAnchorEl, setCityAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceInputs, setPriceInputs] = useState({
    min: filters.priceRange[0] / 1000,
    max: filters.priceRange[1] / 1000,
  });

  const handlePriceClick = (event: React.MouseEvent<HTMLElement>) => {
    setPriceAnchorEl(event.currentTarget);
  };

  const handlePriceClose = () => {
    setPriceAnchorEl(null);
  };

  const handleBedroomsClose = () => {
    setBedroomsAnchorEl(null);
  };



  const handleGroupsClick = (event: React.MouseEvent<HTMLElement>) => {
    setGroupsAnchorEl(event.currentTarget);
  };

  const handleGroupsClose = () => {
    setGroupsAnchorEl(null);
  };

  const handleNeighborhoodClose = () => {
    setNeighborhoodAnchorEl(null);
  };

  const handleCityClose = () => {
    setCityAnchorEl(null);
  };

  const handlePriceInputChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setPriceInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handlePriceApply = () => {
    const minPrice = Math.min(priceInputs.min, priceInputs.max) * 1000;
    const maxPrice = Math.max(priceInputs.min, priceInputs.max) * 1000;
    
    onFiltersChange({
      ...filters,
      priceRange: [minPrice, maxPrice],
    });
    handlePriceClose();
  };

  const handleBedroomsClick = (event: React.MouseEvent<HTMLElement>) => {
    setBedroomsAnchorEl(event.currentTarget);
  };



  const handleNeighborhoodClick = (event: React.MouseEvent<HTMLElement>) => {
    setNeighborhoodAnchorEl(event.currentTarget);
  };

  const handleCityClick = (event: React.MouseEvent<HTMLElement>) => {
    setCityAnchorEl(event.currentTarget);
  };



  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const [sortBy, sortOrder] = event.target.value.split('-');
    onFiltersChange({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.city.length > 0) count++;
    if (filters.neighborhood.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) count++;
    if (filters.bedrooms.length > 0) count++;
    if (filters.bathrooms.length > 0) count++;
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 500) count++;
    if (filters.groups.length > 0) count++;
    if (filters.visibility.length > 0) count++;
    return count;
  };

  const priceOpen = Boolean(priceAnchorEl);
  const bedroomsOpen = Boolean(bedroomsAnchorEl);
  const neighborhoodOpen = Boolean(neighborhoodAnchorEl);
  const cityOpen = Boolean(cityAnchorEl);

  return (
    <>
      {/* Barra de Filtros Fixa */}
                                 <Paper
        sx={{
          position: 'sticky',
          top: { xs: 64, sm: 76 }, // Ajuste para mobile
          zIndex: (theme) => theme.zIndex.appBar - 1,
          p: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 3, // Arredondamento maior dos cantos
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
        }}
      >
                          <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 }, 
          width: '100%',
          flexWrap: { xs: 'wrap', sm: 'nowrap' }
        }}>
                       {/* Bairro */}
            <Button
              variant="outlined"
              size="small"
              onClick={handleNeighborhoodClick}
              sx={{ 
                flex: { xs: '1 1 calc(50% - 4px)', sm: 1 }, 
                justifyContent: 'space-between',
                minHeight: { xs: 36, sm: 40 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <NeighborhoodIcon sx={{ color: theme.palette.text.primary }} fontSize="small" />
                               <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {filters.neighborhood.length === 0
                    ? 'Bairro'
                    : `${filters.neighborhood.length} bairro${filters.neighborhood.length !== 1 ? 's' : ''}`
                  }
                </Typography>
               {filters.neighborhood.length > 0 && (
                                   <Chip
                    label={filters.neighborhood.length}
                    size="small"
                    color="primary"
                    sx={{ height: { xs: 18, sm: 20 }, minWidth: { xs: 18, sm: 20 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
               )}
             </Box>
             <ArrowDownIcon fontSize="small" color="action" />
           </Button>

                       {/* Cidade */}
            <Button
              variant="outlined"
              size="small"
              onClick={handleCityClick}
              sx={{ 
                flex: { xs: '1 1 calc(50% - 4px)', sm: 1 }, 
                justifyContent: 'space-between',
                minHeight: { xs: 36, sm: 40 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <CityIcon sx={{ color: theme.palette.text.primary }} fontSize="small" />
                               <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {filters.city.length === 0
                    ? 'Cidade'
                    : `${filters.city.length} cidade${filters.city.length !== 1 ? 's' : ''}`
                  }
                </Typography>
               {filters.city.length > 0 && (
                                   <Chip
                    label={filters.city.length}
                    size="small"
                    color="primary"
                    sx={{ height: { xs: 18, sm: 20 }, minWidth: { xs: 18, sm: 20 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
               )}
             </Box>
             <ArrowDownIcon fontSize="small" color="action" />
           </Button>

                       {/* Valor */}
            <Button
              variant="outlined"
              size="small"
              onClick={handlePriceClick}
              sx={{ 
                flex: { xs: '1 1 calc(50% - 4px)', sm: 1 }, 
                justifyContent: 'space-between',
                minHeight: { xs: 36, sm: 40 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <MoneyIcon sx={{ color: theme.palette.text.primary }} fontSize="small" />
                               <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {filters.priceRange[0] === 0 && filters.priceRange[1] === 2000000
                    ? 'Valor'
                    : `R$ ${(filters.priceRange[0] / 1000).toFixed(0)}k - R$ ${(filters.priceRange[1] / 1000).toFixed(0)}k`
                  }
                </Typography>
               {(filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) && (
                                   <Chip
                    label="1"
                    size="small"
                    color="primary"
                    sx={{ height: { xs: 18, sm: 20 }, minWidth: { xs: 18, sm: 20 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
               )}
             </Box>
             <ArrowDownIcon fontSize="small" color="action" />
           </Button>

                       {/* Quartos */}
            <Button
              variant="outlined"
              size="small"
              onClick={handleBedroomsClick}
              sx={{ 
                flex: { xs: '1 1 calc(50% - 4px)', sm: 1 }, 
                justifyContent: 'space-between',
                minHeight: { xs: 36, sm: 40 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <HotelIcon sx={{ color: theme.palette.text.primary }} fontSize="small" />
                               <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {filters.bedrooms.length === 0
                    ? 'Quartos'
                    : `${filters.bedrooms.length} quarto${filters.bedrooms.length !== 1 ? 's' : ''}`
                  }
                </Typography>
               {filters.bedrooms.length > 0 && (
                                   <Chip
                    label={filters.bedrooms.length}
                    size="small"
                    color="primary"
                    sx={{ height: { xs: 18, sm: 20 }, minWidth: { xs: 18, sm: 20 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
               )}
             </Box>
             <ArrowDownIcon fontSize="small" color="action" />
           </Button>

                       {/* Grupos - apenas para usuários logados */}
            {isLoggedIn && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleGroupsClick}
                sx={{ 
                  flex: { xs: '1 1 calc(50% - 4px)', sm: 1 }, 
                  justifyContent: 'space-between',
                  minHeight: { xs: 36, sm: 40 },
                  py: { xs: 0.5, sm: 1 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <GroupIcon sx={{ color: theme.palette.text.primary }} fontSize="small" />
                                 <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {filters.groups.length === 0
                      ? 'Grupos'
                      : `${filters.groups.length} grupo${filters.groups.length !== 1 ? 's' : ''}`
                    }
                  </Typography>
                 {filters.groups.length > 0 && (
                                     <Chip
                      label={filters.groups.length}
                      size="small"
                      color="primary"
                      sx={{ height: { xs: 18, sm: 20 }, minWidth: { xs: 18, sm: 20 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    />
                 )}
               </Box>
               <ArrowDownIcon fontSize="small" color="action" />
             </Button>
            )}

                       {/* Mais Filtros */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                flex: { xs: '1 1 calc(50% - 4px)', sm: 1 }, 
                justifyContent: 'space-between',
                minHeight: { xs: 36, sm: 40 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <MenuIcon sx={{ color: theme.palette.text.primary }} fontSize="small" />
                               <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Mais Filtros
                </Typography>
               {getActiveFiltersCount() > 0 && (
                                   <Chip
                    label={getActiveFiltersCount()}
                    size="small"
                    color="primary"
                    sx={{ height: { xs: 18, sm: 20 }, minWidth: { xs: 18, sm: 20 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
               )}
             </Box>
           </Button>

                       {/* Limpar Filtros */}
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="text"
                size="small"
                onClick={onClearFilters}
                color="secondary"
                sx={{ 
                  minHeight: { xs: 36, sm: 40 },
                  py: { xs: 0.5, sm: 1 },
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  flex: { xs: '1 1 100%', sm: 'none' }
                }}
              >
               <ClearIcon sx={{ mr: 1 }} fontSize="small" />
                               <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Limpar
                </Typography>
             </Button>
           )}
         </Box>
      </Paper>

             {/* Popover para Valor */}
       <Popover
         open={priceOpen}
         anchorEl={priceAnchorEl}
         onClose={handlePriceClose}
         anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'left',
         }}
         transformOrigin={{
           vertical: 'top',
           horizontal: 'left',
         }}
       >
         <Box sx={{ p: 2, minWidth: 250 }}>
           <Typography variant="subtitle2" gutterBottom>
             Faixa de Preço
           </Typography>
           <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
             <TextField
               label="Mínimo (R$)"
               type="number"
               size="small"
               value={priceInputs.min}
               onChange={(e) => handlePriceInputChange('min', e.target.value)}
               InputProps={{
                 startAdornment: <Typography variant="caption">R$</Typography>,
               }}
             />
             <TextField
               label="Máximo (R$)"
               type="number"
               size="small"
               value={priceInputs.max}
               onChange={(e) => handlePriceInputChange('max', e.target.value)}
               InputProps={{
                 startAdornment: <Typography variant="caption">R$</Typography>,
               }}
             />
           </Box>
           <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
             <Button size="small" onClick={handlePriceClose}>
               Cancelar
             </Button>
             <Button size="small" variant="contained" onClick={handlePriceApply}>
               Aplicar
             </Button>
           </Box>
         </Box>
       </Popover>

       {/* Popover para Quartos */}
       <Popover
         open={bedroomsOpen}
         anchorEl={bedroomsAnchorEl}
         onClose={handleBedroomsClose}
         anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'left',
         }}
         transformOrigin={{
           vertical: 'top',
           horizontal: 'left',
         }}
       >
         <Box sx={{ p: 2, minWidth: 200 }}>
           <Typography variant="subtitle2" gutterBottom>
             Número de Quartos
           </Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
             {[1, 2, 3, 4, 5, 6].map((bedroom) => (
               <Button
                 key={bedroom}
                 variant={filters.bedrooms.includes(bedroom) ? "contained" : "outlined"}
                 size="small"
                 onClick={() => {
                   const newBedrooms = filters.bedrooms.includes(bedroom)
                     ? filters.bedrooms.filter(b => b !== bedroom)
                     : [...filters.bedrooms, bedroom];
                   onFiltersChange({
                     ...filters,
                     bedrooms: newBedrooms,
                   });
                 }}
                 sx={{ justifyContent: 'flex-start' }}
               >
                 {bedroom} {bedroom === 1 ? 'quarto' : 'quartos'}
               </Button>
             ))}
           </Box>
           <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
             <Button size="small" onClick={handleBedroomsClose}>
               Fechar
             </Button>
           </Box>
         </Box>
       </Popover>

       {/* Popover para Grupos */}
       <Popover
         open={Boolean(groupsAnchorEl)}
         anchorEl={groupsAnchorEl}
         onClose={handleGroupsClose}
         anchorOrigin={{
           vertical: 'bottom',
           horizontal: 'left',
         }}
         transformOrigin={{
           vertical: 'top',
           horizontal: 'left',
         }}
       >
         <Box sx={{ p: 2, minWidth: 200 }}>
           <Typography variant="subtitle2" gutterBottom>
             Grupos
           </Typography>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
             {groups.map((group) => (
               <Button
                 key={group.id}
                 variant={filters.groups.includes(group.id) ? "contained" : "outlined"}
                 size="small"
                 onClick={() => {
                   const newGroups = filters.groups.includes(group.id)
                     ? filters.groups.filter(g => g !== group.id)
                     : [...filters.groups, group.id];
                   onFiltersChange({
                     ...filters,
                     groups: newGroups,
                   });
                 }}
                 sx={{ justifyContent: 'flex-start' }}
               >
                 {group.name}
               </Button>
             ))}
           </Box>
           <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
             <Button size="small" onClick={handleGroupsClose}>
               Fechar
             </Button>
           </Box>
         </Box>
       </Popover>

        {/* Popover para Bairro */}
        <Popover
          open={neighborhoodOpen}
          anchorEl={neighborhoodAnchorEl}
          onClose={handleNeighborhoodClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" gutterBottom>
              Bairros
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {['Centro', 'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Jardins', 'Moema', 'Vila Olímpia', 'Brooklin'].map((neighborhood) => (
                <Button
                  key={neighborhood}
                  variant={filters.neighborhood.includes(neighborhood) ? "contained" : "outlined"}
                  size="small"
                  onClick={() => {
                    const newNeighborhoods = filters.neighborhood.includes(neighborhood)
                      ? filters.neighborhood.filter(n => n !== neighborhood)
                      : [...filters.neighborhood, neighborhood];
                    onFiltersChange({
                      ...filters,
                      neighborhood: newNeighborhoods,
                    });
                  }}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {neighborhood}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={handleNeighborhoodClose}>
                Fechar
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* Popover para Cidade */}
        <Popover
          open={cityOpen}
          anchorEl={cityAnchorEl}
          onClose={handleCityClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cidades
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Recife', 'Fortaleza', 'Curitiba'].map((city) => (
                <Button
                  key={city}
                  variant={filters.city.includes(city) ? "contained" : "outlined"}
                  size="small"
                  onClick={() => {
                    const newCities = filters.city.includes(city)
                      ? filters.city.filter(c => c !== city)
                      : [...filters.city, city];
                    onFiltersChange({
                      ...filters,
                      city: newCities,
                    });
                  }}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {city}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={handleCityClose}>
                Fechar
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* Drawer para Filtros Avançados */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: 400, p: 3 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon color="primary" />
            Filtros Avançados
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Ordenação */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SortIcon fontSize="small" />
              Ordenação
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
                onChange={handleSortChange}
                input={<OutlinedInput />}
              >
                <MenuItem value="price-desc">Maior Preço</MenuItem>
                <MenuItem value="price-asc">Menor Preço</MenuItem>
                <MenuItem value="condominiumFee-desc">Maior Condomínio</MenuItem>
                <MenuItem value="condominiumFee-asc">Menor Condomínio</MenuItem>
                <MenuItem value="area-desc">Maior Área</MenuItem>
                <MenuItem value="area-asc">Menor Área</MenuItem>
                <MenuItem value="createdAt-desc">Mais Recentes</MenuItem>
                <MenuItem value="createdAt-asc">Mais Antigos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider />

          {/* Preço */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Faixa de Preço
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(event, newValue) => {
                onFiltersChange({
                  ...filters,
                  priceRange: newValue as [number, number],
                });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={2000000}
              step={10000}
              valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                R$ {(filters.priceRange[0] / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="caption" color="text.secondary">
                R$ {(filters.priceRange[1] / 1000).toFixed(0)}k
              </Typography>
            </Box>
          </Box>

          {/* Área */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Área (m²)
            </Typography>
            <Slider
              value={filters.areaRange}
              onChange={(event, newValue) => {
                onFiltersChange({
                  ...filters,
                  areaRange: newValue as [number, number],
                });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={500}
              step={10}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {filters.areaRange[0]}m²
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {filters.areaRange[1]}m²
              </Typography>
            </Box>
          </Box>

          {/* Quartos */}
          <FormControl fullWidth size="small">
            <InputLabel>Quartos</InputLabel>
            <Select
              multiple
              value={filters.bedrooms}
              onChange={(event) => {
                const value = event.target.value as number[];
                onFiltersChange({
                  ...filters,
                  bedrooms: value,
                });
              }}
              input={<OutlinedInput label="Quartos" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {[1, 2, 3, 4, 5, 6].map((bedroom) => (
                <MenuItem key={bedroom} value={bedroom}>
                  {bedroom} {bedroom === 1 ? 'quarto' : 'quartos'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Banheiros */}
          <FormControl fullWidth size="small">
            <InputLabel>Banheiros</InputLabel>
            <Select
              multiple
              value={filters.bathrooms}
              onChange={(event) => {
                const value = event.target.value as number[];
                onFiltersChange({
                  ...filters,
                  bathrooms: value,
                });
              }}
              input={<OutlinedInput label="Banheiros" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {[1, 2, 3, 4, 5].map((bathroom) => (
                <MenuItem key={bathroom} value={bathroom}>
                  {bathroom} {bathroom === 1 ? 'banheiro' : 'banheiros'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Vagas de Garagem */}
          <FormControl fullWidth size="small">
            <InputLabel>Vagas de Garagem</InputLabel>
            <Select
              multiple
              value={filters.parkingSpaces}
              onChange={(event) => {
                const value = event.target.value as number[];
                onFiltersChange({
                  ...filters,
                  parkingSpaces: value,
                });
              }}
              input={<OutlinedInput label="Vagas de Garagem" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {[0, 1, 2, 3, 4, 5].map((parking) => (
                <MenuItem key={parking} value={parking}>
                  {parking} {parking === 1 ? 'vaga' : 'vagas'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Grupos - apenas para usuários logados */}
          {isLoggedIn && (
            <FormControl fullWidth size="small">
              <InputLabel>Grupos</InputLabel>
              <Select
                multiple
                value={filters.groups}
                onChange={(event) => {
                  const value = event.target.value as string[];
                  onFiltersChange({
                    ...filters,
                    groups: value,
                  });
                }}
                input={<OutlinedInput label="Grupos" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const group = groups.find(g => g.id === value);
                      return <Chip key={value} label={group?.name || value} size="small" />;
                    })}
                  </Box>
                )}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Visibilidade */}
          <FormControl fullWidth size="small">
            <InputLabel>Visibilidade</InputLabel>
            <Select
              multiple
              value={filters.visibility}
              onChange={(event) => {
                const value = event.target.value as string[];
                onFiltersChange({
                  ...filters,
                  visibility: value,
                });
              }}
              input={<OutlinedInput label="Visibilidade" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value === 'public' ? 'Público' : 'Privado'} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="public">Público</MenuItem>
              <MenuItem value="private">Privado</MenuItem>
            </Select>
          </FormControl>

          {/* Botões de Ação */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClearFilters}
              startIcon={<ClearIcon />}
            >
              Limpar Filtros
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleDrawerClose}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Filters;
