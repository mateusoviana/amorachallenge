import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle,
  DialogContent, TextField, FormControlLabel, Switch, Chip,
  IconButton, Grid, Slider, Autocomplete
} from '@mui/material';
import { Add, Delete, Edit, NotificationsActive } from '@mui/icons-material';
import { AlertCriteria } from '../../types';
import { AlertService } from '../../services/alertService';
import { useAuth } from '../../hooks/useAuth';

export const AlertsManager: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertCriteria[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertCriteria | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    priceRange: [0, 2000000] as [number, number],
    areaRange: [0, 500] as [number, number],
    bedrooms: [] as number[],
    bathrooms: [] as number[],
    parkingSpaces: [] as number[],
    cities: [] as string[],
    neighborhoods: [] as string[],
    emailNotifications: true,
    whatsappNotifications: false
  });

  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4, 5];
  const parkingOptions = [0, 1, 2, 3, 4];
  const [cityOptions, setCityOptions] = useState<string[]>(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília']);

  useEffect(() => {
    if (user) loadAlerts();
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;
    try {
      const userAlerts = await AlertService.getUserAlerts(user.id);
      setAlerts(userAlerts);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const alertData = {
        userId: user.id,
        name: formData.name,
        isActive: true,
        priceMin: formData.priceRange[0] > 0 ? formData.priceRange[0] : undefined,
        priceMax: formData.priceRange[1] < 2000000 ? formData.priceRange[1] : undefined,
        areaMin: formData.areaRange[0] > 0 ? formData.areaRange[0] : undefined,
        areaMax: formData.areaRange[1] < 500 ? formData.areaRange[1] : undefined,
        bedrooms: formData.bedrooms.length ? formData.bedrooms : undefined,
        bathrooms: formData.bathrooms.length ? formData.bathrooms : undefined,
        parkingSpaces: formData.parkingSpaces.length ? formData.parkingSpaces : undefined,
        cities: formData.cities.length ? formData.cities : undefined,
        neighborhoods: formData.neighborhoods.length ? formData.neighborhoods : undefined,
        emailNotifications: formData.emailNotifications,
        whatsappNotifications: formData.whatsappNotifications
      };

      await AlertService.createAlert(alertData);
      await loadAlerts();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar alerta:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAlert(null);
    setFormData({
      name: '',
      priceRange: [0, 2000000],
      areaRange: [0, 500],
      bedrooms: [],
      bathrooms: [],
      parkingSpaces: [],
      cities: [],
      neighborhoods: [],
      emailNotifications: true,
      whatsappNotifications: false
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          <NotificationsActive sx={{ mr: 1, verticalAlign: 'middle' }} />
          aMORA Avisa
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Novo Alerta
        </Button>
      </Box>

      <Grid container spacing={2}>
        {alerts.map((alert) => (
          <Grid item xs={12} md={6} key={alert.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Typography variant="h6">{alert.name}</Typography>
                  <Box>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box mt={2}>
                  {alert.priceMin && (
                    <Chip label={`Preço: R$ ${alert.priceMin.toLocaleString()} - ${alert.priceMax?.toLocaleString() || '∞'}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                  {alert.bedrooms && (
                    <Chip label={`Quartos: ${alert.bedrooms.join(', ')}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                  {alert.cities && (
                    <Chip label={`Cidades: ${alert.cities.join(', ')}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                </Box>

                <Box mt={2} display="flex" gap={1}>
                  {alert.emailNotifications && <Chip label="📧 Email" size="small" color="primary" />}
                  {alert.whatsappNotifications && <Chip label="📱 WhatsApp" size="small" color="success" />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Novo Alerta aMORA Avisa</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Alerta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />

          <Typography gutterBottom sx={{ mt: 3 }}>Faixa de Preço</Typography>
          <Slider
            value={formData.priceRange}
            onChange={(_, value) => setFormData({ ...formData, priceRange: value as [number, number] })}
            valueLabelDisplay="auto"
            min={0}
            max={2000000}
            step={50000}
            valueLabelFormat={(value) => `R$ ${value.toLocaleString()}`}
          />

          <Typography gutterBottom sx={{ mt: 3 }}>Área (m²)</Typography>
          <Slider
            value={formData.areaRange}
            onChange={(_, value) => setFormData({ ...formData, areaRange: value as [number, number] })}
            valueLabelDisplay="auto"
            min={0}
            max={500}
            step={10}
          />

          <Autocomplete
            multiple
            options={bedroomOptions}
            value={formData.bedrooms}
            onChange={(_, value) => setFormData({ ...formData, bedrooms: value })}
            getOptionLabel={(option) => `${option} quarto${option > 1 ? 's' : ''}`}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={`${option} quarto${option > 1 ? 's' : ''}`} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Quartos" margin="normal" />}
          />

          <Autocomplete
            multiple
            options={bathroomOptions}
            value={formData.bathrooms}
            onChange={(_, value) => setFormData({ ...formData, bathrooms: value })}
            getOptionLabel={(option) => `${option} banheiro${option > 1 ? 's' : ''}`}
            renderInput={(params) => <TextField {...params} label="Banheiros" margin="normal" />}
          />

          <Autocomplete
            multiple
            options={parkingOptions}
            value={formData.parkingSpaces}
            onChange={(_, value) => setFormData({ ...formData, parkingSpaces: value })}
            getOptionLabel={(option) => option === 0 ? 'Sem vaga' : `${option} vaga${option > 1 ? 's' : ''}`}
            renderInput={(params) => <TextField {...params} label="Vagas" margin="normal" />}
          />

          <Autocomplete
            multiple
            freeSolo
            options={cityOptions}
            value={formData.cities}
            onChange={(_, value) => setFormData({ ...formData, cities: value })}
            renderInput={(params) => <TextField {...params} label="Cidades (digite qualquer cidade)" margin="normal" />}
          />

          <Box mt={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                />
              }
              label="📧 Notificações por Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.whatsappNotifications}
                  onChange={(e) => setFormData({ ...formData, whatsappNotifications: e.target.checked })}
                />
              }
              label="📱 Notificações por WhatsApp (em breve)"
              disabled
            />
          </Box>

          <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleSave}>Salvar Alerta</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};