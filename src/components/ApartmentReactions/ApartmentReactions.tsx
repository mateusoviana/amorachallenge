import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  AddReaction as AddReactionIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { ReactionType, ApartmentReaction, ReactionSummary } from '../../types';

interface ApartmentReactionsProps {
  apartmentId: string;
  groupId: string;
  reactions: ApartmentReaction[];
  onReactionChange: (reaction: ReactionType | null) => void;
}

const reactionConfig = {
  love: { emoji: '❤️', label: 'Amei', color: '#e91e63' },
  like: { emoji: '👍', label: 'Gostei', color: '#4caf50' },
  unsure: { emoji: '🤔', label: 'Não sei', color: '#ff9800' },
  dislike: { emoji: '👎', label: 'Não gostei', color: '#f44336' },
  hate: { emoji: '🤮', label: 'Odiei', color: '#9c27b0' },
};

const ApartmentReactions: React.FC<ApartmentReactionsProps> = ({
  apartmentId,
  groupId,
  reactions,
  onReactionChange,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [reactionMenuAnchor, setReactionMenuAnchor] = useState<HTMLElement | null>(null);
  const [detailsAnchor, setDetailsAnchor] = useState<HTMLElement | null>(null);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [reactionSummary, setReactionSummary] = useState<ReactionSummary>({
    love: 0,
    like: 0,
    unsure: 0,
    dislike: 0,
    hate: 0,
    total: 0,
  });

  useEffect(() => {
    // Calcular resumo das reações
    const summary = reactions.reduce(
      (acc, reaction) => {
        acc[reaction.reaction]++;
        acc.total++;
        return acc;
      },
      { love: 0, like: 0, unsure: 0, dislike: 0, hate: 0, total: 0 }
    );
    setReactionSummary(summary);

    // Encontrar reação do usuário atual
    const currentUserReaction = reactions.find(r => r.userId === user?.id);
    setUserReaction(currentUserReaction?.reaction || null);
  }, [reactions, user?.id]);

  const handleReactionClick = (reaction: ReactionType, event: React.MouseEvent) => {
    event.stopPropagation();
    const newReaction = userReaction === reaction ? null : reaction;
    setUserReaction(newReaction);
    onReactionChange(newReaction);
    setReactionMenuAnchor(null);
  };

  const handleReactionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setReactionMenuAnchor(event.currentTarget);
  };

  const handleDetailsOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (reactionSummary.total > 0) {
      setDetailsAnchor(event.currentTarget);
    }
  };

  const handleClose = () => {
    setReactionMenuAnchor(null);
    setDetailsAnchor(null);
  };

  const getMostPopularReaction = (): ReactionType | null => {
    if (reactionSummary.total === 0) return null;
    
    const reactions = Object.entries(reactionSummary)
      .filter(([key]) => key !== 'total')
      .sort(([, a], [, b]) => b - a);
    
    return reactions[0][1] > 0 ? reactions[0][0] as ReactionType : null;
  };

  const mostPopular = getMostPopularReaction();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Reações existentes */}
      {reactionSummary.total > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {Object.entries(reactionConfig).map(([type, config]) => {
            const count = reactionSummary[type as ReactionType];
            if (count === 0) return null;
            
            return (
              <Chip
                key={type}
                size="small"
                label={`${config.emoji} ${count}`}
                onClick={handleDetailsOpen}
                sx={{
                  bgcolor: `${config.color}15`,
                  color: config.color,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: `${config.color}25`,
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* Botão para adicionar reação */}
      <Tooltip title="Reagir">
        <IconButton
          size="small"
          onClick={handleReactionMenuOpen}
          sx={{
            width: 28,
            height: 28,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main',
            },
          }}
        >
          <AddReactionIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Menu de seleção de reações */}
      <Popover
        open={Boolean(reactionMenuAnchor)}
        anchorEl={reactionMenuAnchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Como você avalia este imóvel?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(reactionConfig).map(([type, config]) => (
              <Button
                key={type}
                variant={userReaction === type ? 'contained' : 'text'}
                startIcon={<span style={{ fontSize: '16px' }}>{config.emoji}</span>}
                onClick={(e) => handleReactionClick(type as ReactionType, e)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: userReaction === type ? 'white' : config.color,
                  bgcolor: userReaction === type ? config.color : 'transparent',
                  '&:hover': {
                    bgcolor: userReaction === type ? config.color : `${config.color}15`,
                  },
                }}
              >
                {config.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Popover>

      {/* Popover com detalhes das reações */}
      <Popover
        open={Boolean(detailsAnchor)}
        anchorEl={detailsAnchor}
        onClose={handleClose}
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Reações ({reactionSummary.total})
          </Typography>
          
          <Divider sx={{ mb: 1 }} />

          {/* Lista de usuários agrupados por reação */}
          {Object.entries(reactionConfig).map(([type, config]) => {
            const usersWithReaction = reactions.filter(r => r.reaction === type);
            if (usersWithReaction.length === 0) return null;
            
            return (
              <Box key={type} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: config.color, fontWeight: 600 }}>
                  {config.emoji} {config.label} ({usersWithReaction.length})
                </Typography>
                <Box sx={{ ml: 1 }}>
                  {usersWithReaction.map((reaction) => (
                    <Typography key={reaction.id} variant="body2" color="text.secondary">
                      • {reaction.user.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
};

export default ApartmentReactions;