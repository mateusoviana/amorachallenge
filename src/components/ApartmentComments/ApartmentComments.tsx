import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Comment as CommentIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { ApartmentComment } from '../../types';
import { commentService } from '../../services/commentService';

interface ApartmentCommentsProps {
  apartmentId: string;
  groupId: string;
  open: boolean;
  onClose: () => void;
  commentsCount: number;
  onCommentsCountChange: (count: number) => void;
}

const ApartmentComments: React.FC<ApartmentCommentsProps> = ({
  apartmentId,
  groupId,
  open,
  onClose,
  commentsCount,
  onCommentsCountChange,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<ApartmentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadComments();
    }
  }, [open, apartmentId, groupId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const apartmentComments = await commentService.getCommentsByApartmentAndGroup(
        apartmentId,
        groupId
      );
      setComments(apartmentComments);
      onCommentsCountChange(apartmentComments.length);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user?.id || submitting) return;

    setSubmitting(true);
    try {
      const comment = await commentService.addComment(
        apartmentId,
        groupId,
        user.id,
        newComment.trim()
      );
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      onCommentsCountChange(comments.length + 1);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user?.id) return;

    try {
      await commentService.removeComment(commentId, user.id);
      setComments(prev => prev.filter(c => c.id !== commentId));
      onCommentsCountChange(comments.length - 1);
    } catch (error) {
      console.error('Erro ao remover comentário:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CommentIcon />
          <Typography variant="h6">
            Comentários ({comments.length})
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">Carregando comentários...</Typography>
          </Box>
        ) : comments.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {comment.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {comment.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                        {comment.userId === user?.id && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteComment(comment.id)}
                            sx={{ ml: 'auto' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                        {comment.comment}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < comments.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Digite seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            disabled={submitting}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SendIcon fontSize="small" />
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ApartmentComments;