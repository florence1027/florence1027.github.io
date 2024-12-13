import { Button } from '@mui/material';
import { auth, getToken } from '../firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IEmprunt } from '../models/Emprunt';
import { Grid2 as Grid, Snackbar, Alert} from '@mui/material';
import Fiche from './fiche.component';
import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { BarreHaut } from './barreHaut.component';

/**
 * Vue de la page d'accueil
 * Affiche tous les emprunts dans une grille ainsi qu'une barre du haut 
 * @returns La vue
 */
export const Home = () => {  
  const [emprunts, setEmprunts] = useState<IEmprunt[]>([]);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [message, setMessage] = useState<{
    text: string;
    severity: 'success' | 'error';
  } | null>(null);

  /**
   * Appel à l'api pour récupérer tous les emprunts
   */
  const fetchEmprunts = async () => {
    setEmprunts([]);
    const token = await getToken();

    //console.log('token:', token);
    
    const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setEmprunts(data.emprunts as IEmprunt[]);
  };

  /**
   * Appel à l'api pour récupérer tous les emprunts selon un code ISBN
   */
  const fetchEmpruntsISBN = async (isbn: string) => {
    if (isbn.length == 0 || isbn == "") {
      fetchEmprunts();
    }
    else {
      setEmprunts([]);
      const token = await getToken();
      const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts/livre/'+isbn, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setEmprunts(data.emprunts as IEmprunt[]);
    }
  }

  /**
   * Appel à l'api pour récupérer tous les emprunts selon un nom 
   */
  const fetchEmpruntsNom = async (nom: string) => {
    if (nom.length == 0 || nom == "") {
      fetchEmprunts();
    }
    else {
      setEmprunts([]);
      const token = await getToken();
      const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts/compte/'+nom, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setEmprunts(data.emprunts as IEmprunt[]);
    }
  }
  
  //Chercher les emprunts au chargement
  useEffect(() => {
    if (!user) return;
    fetchEmprunts();
  }, [user, loading]);

  //Chercher les emprunts après une modif ou une suppression
  useEffect(() => {
    //Vérifier que le popup est apparu pour ne pas rafraichir à sa fin
    if (message != null) {
      fetchEmprunts();
    }
  }, [message]);


  return (
    <>
      <BarreHaut 
          onRechercheISBN={(isbn) => fetchEmpruntsISBN(isbn)}
          onRechercheNom={(nom) => fetchEmpruntsNom(nom)}
      />
      <Typography gutterBottom marginTop={5} variant="h2" component="h2" textAlign={"center"}>
        <FormattedMessage 
          id="home.titre"
          defaultMessage="Titre"
          values={{  }}
        />
      </Typography>
      <Button variant="contained" onClick={() => navigate('/ajouter')}>
        <FormattedMessage 
          id="home.boutonajouter"
          defaultMessage="ajouter"
          values={{  }}
        />
      </Button>
      <Typography gutterBottom marginTop={5} variant="h6" component="h6" textAlign={"center"}>
        <FormattedMessage 
          id="home.avertissement"
          defaultMessage="avertissement"
          values={{  }}
        />
      </Typography>  
      <Grid container spacing={2}>

        {emprunts &&
          emprunts.map((emprunt, index) => {
            return (
              <Grid key={index}>
                <Fiche
                  emprunt={emprunt} 
                  messageSnackbar={(text, severity) => setMessage({text: text, severity: severity})}
                />
              </Grid>
            );
          })}
      </Grid>
      {message && (
          <Snackbar open autoHideDuration={6000} onClose={() => setMessage(null)}>
            <Alert
              onClose={() => setMessage(null)}
              severity={message.severity}
              sx={{ width: '100%' }}
            >
              {message.text}
            </Alert>
          </Snackbar>
        )}
    </>
  );
};
