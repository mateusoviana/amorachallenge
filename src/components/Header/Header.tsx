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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Compare as CompareIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  NotificationsActive as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
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

                {/* Desktop Navigation */}
        <Box sx={{ 
          display: { xs: 'none', sm: 'flex' }, 
          alignItems: 'center', 
          gap: 2
        }}>

          <Button
            color="inherit"
            startIcon={<CompareIcon />}
            onClick={() => navigate('/compare')}
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.875rem',
              px: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            aMORA Compara
          </Button>

          <Button
            color="inherit"
            startIcon={<FavoriteIcon />}
            onClick={() => navigate('/match')}
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.875rem',
              px: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            aMORA Match
          </Button>

          {user && (
            <Button
              color="inherit"
              startIcon={<NotificationsIcon />}
              onClick={() => navigate('/alerts')}
              sx={{ 
                color: 'white', 
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: '0.875rem',
                px: 2,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              aMORA Avisa
            </Button>
          )}

          {user && (
            <>
                             <Button
                 color="inherit"
                 startIcon={<AddIcon />}
                 onClick={() => navigate('/add-apartment')}
                 sx={{ 
                   color: 'white', 
                   fontWeight: 600,
                   fontSize: '0.875rem',
                   px: 2
                 }}
               >
                 Meus Imóveis
               </Button>

              <Button
                color="inherit"
                startIcon={<GroupIcon />}
                onClick={() => navigate('/groups')}
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2
                }}
              >
                Grupos
              </Button>

              {user.userType === 'realtor' && (
                <Button
                  color="inherit"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 2
                  }}
                >
                  Dashboard
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
                fontSize: '0.875rem',
                px: 2
              }}
            >
              Entrar
            </Button>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: { 
            width: 280,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white'
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box
              component="img"
              src="/static/img/logo.png"
              alt="aMORA"
              sx={{
                height: '32px',
                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
              }}
            />
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ pt: 0 }}>

                         <ListItem 
               button 
               onClick={() => handleMobileNavigation('/compare')}
               sx={{ 
                 borderRadius: 1, 
                 mb: 1,
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
               }}
             >
               <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                 <CompareIcon />
               </ListItemIcon>
               <ListItemText primary="aMORA Compara" />
             </ListItem>

             <ListItem 
               button 
               onClick={() => handleMobileNavigation('/match')}
               sx={{ 
                 borderRadius: 1, 
                 mb: 1,
                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
                 '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
               }}
             >
               <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                 <FavoriteIcon />
               </ListItemIcon>
               <ListItemText primary="aMORA Match" />
             </ListItem>

            {user && (
              <ListItem 
                button 
                onClick={() => handleMobileNavigation('/alerts')}
                sx={{ 
                  borderRadius: 1, 
                  mb: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="aMORA Avisa" />
              </ListItem>
            )}

            {user && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                
                                 <ListItem 
                   button 
                   onClick={() => handleMobileNavigation('/add-apartment')}
                   sx={{ 
                     borderRadius: 1, 
                     mb: 1,
                     '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                   }}
                 >
                   <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                     <AddIcon />
                   </ListItemIcon>
                   <ListItemText primary="Meus Imóveis" />
                 </ListItem>

                <ListItem 
                  button 
                  onClick={() => handleMobileNavigation('/groups')}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Grupos" />
                </ListItem>

                {user.userType === 'realtor' && (
                  <ListItem 
                    button 
                    onClick={() => handleMobileNavigation('/dashboard')}
                    sx={{ 
                      borderRadius: 1, 
                      mb: 1,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                )}

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />

                <ListItem 
                  button 
                  onClick={() => handleMobileNavigation('/profile')}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Perfil" />
                </ListItem>

                <ListItem 
                  button 
                  onClick={handleLogout}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItem>
              </>
            )}

            {!user && (
              <>
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                
                <ListItem 
                  button 
                  onClick={() => handleMobileNavigation('/login')}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Entrar" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
