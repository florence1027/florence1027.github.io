import { Paper, AppBar, Toolbar, InputBase, SelectChangeEvent  } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { logout } from '../firebase';
import { styled, alpha } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import { Button, Select, MenuItem } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import Francais from '../lang/fr.json';
import Anglais from '../lang/en.json';
import { LangueContext } from '../contexts/langue.context';
import { useContext, useState } from 'react';
import MediaQuery from 'react-responsive'
import { IconButton } from '@mui/material';
import { Drawer, Box, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';

interface IBarreHaut {
  onRechercheISBN: (isbn: string) => void;
  onRechercheNom: (nom: string) => void;
}

/**
 * 
 * CODE TIRÉ DE https://mui.com/material-ui/react-app-bar/
 */
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

/** FIN DU CODE EMPRUNTÉ */

export const BarreHaut = (props: IBarreHaut) => {  
  const intl = useIntl();
  const { langue, setLangue } = useContext(LangueContext);
  const {setMessageLangue} = useContext(LangueContext);
  const changerLangue = async (event: SelectChangeEvent) => {
    setLangue(event.target.value);
    setMessageLangue(event.target.value==="fr" ? Francais:Anglais);
  };
  const [menuOuvert, setMenuOuvert] = useState(false);

  const toggleMenu = async (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOuvert(true);
  };


  return (
    <>
      <MediaQuery minWidth={1224}>
        <AppBar position="static">
            <Toolbar sx={{display:'flex', justifyContent:'space-around'}}>
            <Paper>
                <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={intl.formatMessage({id: 'barrerecherche.isbn.placeholder'})}
                    onChange={(e) => 
                    props.onRechercheISBN(e.target.value)
                    }
                    inputProps={{ 'aria-label': 'search' }}
                />
                </Search>
            </Paper>
            <Paper>
                <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={intl.formatMessage({id: 'barrerecherche.nom.placeholder'})}
                    onChange={(e) => 
                    props.onRechercheNom(e.target.value)
                    }
                    inputProps={{ 'aria-label': 'search' }}
                />
                </Search>
            </Paper>
            <Paper>
              <Select size="small" value={langue} onChange={changerLangue}>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="en">English</MenuItem>              
              </Select>
            </Paper>
            <Paper>
              <Button variant="outlined" onClick={() => logout()}>
                <FormattedMessage 
                  id="home.boutondeconnecter"
                  defaultMessage="deconnecter"
                  values={{  }}
                />
              </Button>
            </Paper>
            </Toolbar>
        </AppBar>
      </MediaQuery>
      <MediaQuery maxWidth={1224}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={toggleMenu}>
              <Badge>
                <MenuIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="right"
          open={menuOuvert}
          onClose={() => {
            setMenuOuvert(false);
          }}
        >
          <Box sx={{ width: 300, height: '100%', backgroundColor:'whitesmoke' }}>
            <Toolbar sx={{display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
              <Typography gutterBottom marginTop={5} variant="h4" component="h4" textAlign={"center"}>
              <FormattedMessage 
                  id="barrerecherche.menu"
                  defaultMessage="menu"
                  values={{  }}
                />
              </Typography>
              <Paper sx={{marginTop: 5, marginBottom: 3}}>
                  <Search>
                  <SearchIconWrapper>
                      <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                      placeholder={intl.formatMessage({id: 'barrerecherche.isbn.placeholder'})}
                      onChange={(e) => 
                      props.onRechercheISBN(e.target.value)
                      }
                      inputProps={{ 'aria-label': 'search' }}
                  />
                  </Search>
              </Paper>
              <Paper sx={{marginTop: 3, marginBottom: 3}}>
                  <Search>
                  <SearchIconWrapper>
                      <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                      placeholder={intl.formatMessage({id: 'barrerecherche.nom.placeholder'})}
                      onChange={(e) => 
                      props.onRechercheNom(e.target.value)
                      }
                      inputProps={{ 'aria-label': 'search' }}
                  />
                  </Search>
              </Paper>
              <Paper sx={{marginTop: 3, marginBottom: 3}}>
                <Select size="small" value={langue} onChange={changerLangue}>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">English</MenuItem>              
                </Select>
              </Paper>
              <Paper sx={{marginTop: 3, marginBottom: 3}}>
                <Button variant="outlined" onClick={() => logout()}>
                  <FormattedMessage 
                    id="home.boutondeconnecter"
                    defaultMessage="deconnecter"
                    values={{  }}
                  />
                </Button>
              </Paper>
            </Toolbar>
          </Box>
        </Drawer>
      </MediaQuery>
    </>
  );
};
