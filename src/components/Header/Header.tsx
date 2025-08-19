import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => navigate('/')}
        >
          <Box
            component="img"
            src="/static/img/logo.png"
            alt="aMORA"
            sx={{
              height: { xs: '32px', sm: '40px' },
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
            }}
          />
        </Box>

                <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' }
        }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
              minWidth: { xs: 'auto', sm: 'auto' }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Home</Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>H</Box>
          </Button>

          <Button
            color="inherit"
            startIcon={<CompareIcon />}
            onClick={() => navigate('/compare')}
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Amora Compara</Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Compara</Box>
          </Button>

          {user && (
            <>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => navigate('/add-apartment')}
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  minWidth: { xs: 'auto', sm: 'auto' }
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Adicionar Imóvel</Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Adicionar</Box>
              </Button>

              <Button
                color="inherit"
                startIcon={<GroupIcon />}
                onClick={() => navigate('/groups')}
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  minWidth: { xs: 'auto', sm: 'auto' }
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Grupos</Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Grupos</Box>
              </Button>

              {user.userType === 'realtor' && (
                <Button
                  color="inherit"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 },
                    minWidth: { xs: 'auto', sm: 'auto' }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Dashboard</Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Dash</Box>
                </Button>
              )}

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ color: 'white' }}
              >
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}

          {!user && (
            <Button
              color="inherit"
              startIcon={<AccountCircleIcon />}
              onClick={() => navigate('/login')}
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 },
                minWidth: { xs: 'auto', sm: 'auto' }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Entrar</Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Login</Box>
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
