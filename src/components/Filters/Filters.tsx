import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { FilterOptions, Group } from '../../types';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  groups: Group[];
  onClearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  groups,
  onClearFilters,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>('filters');

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: newValue as [number, number],
    });
  };

  const handleAreaChange = (event: Event, newValue: number | number[]) => {
    onFiltersChange({
      ...filters,
      areaRange: newValue as [number, number],
    });
  };

  const handleBedroomsChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    onFiltersChange({
      ...filters,
      bedrooms: value,
    });
  };

  const handleBathroomsChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    onFiltersChange({
      ...filters,
      bathrooms: value,
    });
  };

  const handleParkingChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    onFiltersChange({
      ...filters,
      parkingSpaces: value,
    });
  };

  const handleCityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      city: value,
    });
  };

  const handleNeighborhoodChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      neighborhood: value,
    });
  };

  const handleGroupsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      groups: value,
    });
  };

  const handleVisibilityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      visibility: value,
    });
  };

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: 'fit-content',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 20,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          Filtros
        </Typography>
        <Button
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          variant="outlined"
          size="small"
          color="secondary"
        >
          Limpar
        </Button>
      </Box>

      <Accordion
        expanded={expanded === 'filters'}
        onChange={handleAccordionChange('filters')}
        sx={{ boxShadow: 'none' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Filtros de Imóveis
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Preço */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Faixa de Preço
              </Typography>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000000}
                step={10000}
                valueLabelFormat={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                sx={{ color: theme.palette.primary.main }}
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
                onChange={handleAreaChange}
                valueLabelDisplay="auto"
                min={0}
                max={500}
                step={10}
                sx={{ color: theme.palette.primary.main }}
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
            <FormControl fullWidth>
              <InputLabel>Quartos</InputLabel>
              <Select
                multiple
                value={filters.bedrooms}
                onChange={handleBedroomsChange}
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
            <FormControl fullWidth>
              <InputLabel>Banheiros</InputLabel>
              <Select
                multiple
                value={filters.bathrooms}
                onChange={handleBathroomsChange}
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
            <FormControl fullWidth>
              <InputLabel>Vagas de Garagem</InputLabel>
              <Select
                multiple
                value={filters.parkingSpaces}
                onChange={handleParkingChange}
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

            {/* Cidade */}
            <FormControl fullWidth>
              <InputLabel>Cidade</InputLabel>
              <Select
                multiple
                value={filters.city}
                onChange={handleCityChange}
                input={<OutlinedInput label="Cidade" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'].map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Bairro */}
            <FormControl fullWidth>
              <InputLabel>Bairro</InputLabel>
              <Select
                multiple
                value={filters.neighborhood}
                onChange={handleNeighborhoodChange}
                input={<OutlinedInput label="Bairro" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {['Centro', 'Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Jardins'].map((neighborhood) => (
                  <MenuItem key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Grupos */}
            <FormControl fullWidth>
              <InputLabel>Grupos</InputLabel>
              <Select
                multiple
                value={filters.groups}
                onChange={handleGroupsChange}
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

            {/* Visibilidade */}
            <FormControl fullWidth>
              <InputLabel>Visibilidade</InputLabel>
              <Select
                multiple
                value={filters.visibility}
                onChange={handleVisibilityChange}
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
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default Filters;
