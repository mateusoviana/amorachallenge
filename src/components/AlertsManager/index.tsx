import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle,
  DialogContent, TextField, FormControlLabel, Switch, Chip,
  IconButton, Grid, Slider, Autocomplete, Snackbar, Alert, DialogActions
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
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    alertId: string | null;
    alertName: string;
  }>({
    open: false,
    alertId: null,
    alertName: ''
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
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
      setSnackbar({
        open: true,
        message: 'Erro ao carregar alertas. Tente novamente.',
        severity: 'error'
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    // Validação básica
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Por favor, insira um nome para o alerta.',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    try {
      const alertData = {
        userId: user.id,
        name: formData.name.trim(),
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

      if (editingAlert) {
        // Atualizar alerta existente
        await AlertService.updateAlert(editingAlert.id, alertData);
        setSnackbar({
          open: true,
          message: 'Alerta atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        // Criar novo alerta
        await AlertService.createAlert(alertData);
        setSnackbar({
          open: true,
          message: 'Alerta criado com sucesso!',
          severity: 'success'
        });
      }
      
      await loadAlerts();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar alerta:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar alerta. Tente novamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alert: AlertCriteria) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      priceRange: [
        alert.priceMin || 0,
        alert.priceMax || 2000000
      ],
      areaRange: [
        alert.areaMin || 0,
        alert.areaMax || 500
      ],
      bedrooms: alert.bedrooms || [],
      bathrooms: alert.bathrooms || [],
      parkingSpaces: alert.parkingSpaces || [],
      cities: alert.cities || [],
      neighborhoods: alert.neighborhoods || [],
      emailNotifications: alert.emailNotifications,
      whatsappNotifications: alert.whatsappNotifications
    });
    setOpen(true);
  };

  const handleDeleteClick = (alert: AlertCriteria) => {
    setDeleteConfirm({
      open: true,
      alertId: alert.id,
      alertName: alert.name
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.alertId) return;
    
    setLoading(true);
    try {
      await AlertService.deleteAlert(deleteConfirm.alertId);
      await loadAlerts();
      setSnackbar({
        open: true,
        message: 'Alerta excluído com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao excluir alerta:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir alerta. Tente novamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteConfirm({ open: false, alertId: null, alertName: '' });
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
                    <IconButton size="small" onClick={() => handleEdit(alert)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(alert)}>
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

      {/* Diálogo de criação/edição */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAlert ? `Editar Alerta: ${editingAlert.name}` : 'Novo Alerta aMORA Avisa'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Alerta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
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
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={loading}
            >
              {editingAlert ? 'Atualizar Alerta' : 'Salvar Alerta'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, alertId: null, alertName: '' })}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o alerta "{deleteConfirm.alertName}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, alertId: null, alertName: '' })}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
