import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Info as InfoIcon,
  Favorite as LoveIcon,
  ThumbUp as LikeIcon,
  Help as UnsureIcon,
  ThumbDown as DislikeIcon,
  HeartBroken as HateIcon,
} from '@mui/icons-material';

const ReactionScoringInfo: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const reactionData = [
    { icon: <LoveIcon sx={{ color: '#e91e63' }} />, name: 'Amei', points: '+2', description: 'Reação muito positiva' },
    { icon: <LikeIcon sx={{ color: '#4caf50' }} />, name: 'Gostei', points: '+1', description: 'Reação positiva' },
    { icon: <UnsureIcon sx={{ color: '#ff9800' }} />, name: 'Não sei', points: '0', description: 'Reação neutra' },
    { icon: <DislikeIcon sx={{ color: '#f44336' }} />, name: 'Não gostei', points: '-1', description: 'Reação negativa' },
    { icon: <HateIcon sx={{ color: '#d32f2f' }} />, name: 'Odiei', points: '-2', description: 'Reação muito negativa' },
  ];

  return (
    <>
      <Tooltip title="Como funciona a ordenação por reações">
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            Sistema de Pontuação por Reações
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Os imóveis são automaticamente ordenados baseado nas reações dos membros do grupo:
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reação</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell align="center">Pontos</TableCell>
                  <TableCell>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reactionData.map((reaction) => (
                  <TableRow key={reaction.name}>
                    <TableCell>{reaction.icon}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{reaction.name}</TableCell>
                    <TableCell align="center" sx={{ 
                      fontWeight: 700,
                      color: reaction.points.includes('+') ? 'success.main' : 
                             reaction.points.includes('-') ? 'error.main' : 'text.secondary'
                    }}>
                      {reaction.points}
                    </TableCell>
                    <TableCell>{reaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
              Critérios de Ordenação:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" sx={{ mb: 1 }}>
                <strong>Pontuação Total:</strong> Imóveis com maior pontuação aparecem primeiro
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                <strong>Critério de Desempate:</strong> Em caso de empate, o imóvel com menos rejeições (👎 e 💔) ganha
              </Typography>
              <Typography component="li">
                <strong>Segundo Desempate:</strong> Imóvel com mais reações totais
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            p: 2, 
            bgcolor: 'info.light', 
            borderRadius: 1,
            border: `1px solid ${theme.palette.info.main}20`
          }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              <strong>Exemplo:</strong> Um imóvel com "1 Gostei + 1 Não sei" (1 ponto, 0 rejeições) 
              fica à frente de um imóvel com "1 Amei + 1 Não gostei" (1 ponto, 1 rejeição).
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained">
            Entendi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReactionScoringInfo;