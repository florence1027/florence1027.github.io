import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getToken } from '../firebase';
import { FormattedMessage } from 'react-intl';
const theme = createTheme({
  palette: {
    secondary: {
      main: '#222b38',
    },
  },
});

/**
 * Paramètre du popup
 */
interface PopupSupprimerProps {
    estOuvert: boolean;
    idEmprunt: string | undefined;
    nomEmprunt: string | undefined;
    onChangementOuvert: (etat: boolean) => void;
    messageSnackbar: (text: string, severity: "success" | "error") => void;
}

/**
 * Afficher un popup pour confirmer la suppression d'un emprunt
*/
export default function PopupSupprimer(props: PopupSupprimerProps) {
    const [ouvert, setOuvert] = useState(props.estOuvert);

    useEffect(() => {
        setOuvert(props.estOuvert)
      }, [props.estOuvert]);
    
    const fermerPopup = () => {
        setOuvert(false);
    };

    /**
     * Appel à l'api
     */
    const supprimerEmprunt = async () => {
        const token = await getToken();
        try {
            const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts/'+props.idEmprunt, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json;charset=UTF-8',
                },
            });
            if (!response.ok) {
                props.messageSnackbar(response.statusText, "error");
                throw new Error(`Error: ${response.statusText}`);
                
            }
            const data = await response.json();
            props.messageSnackbar(data, "success");
        } catch (error) {
            props.messageSnackbar("Il y a eu une erreur", "error");
            console.error('Request failed', error);
        } finally {
            fermerPopup()
        }
    };
  
    return (
        <ThemeProvider theme={theme}>
            <Dialog
            open={ouvert}
            onClose={fermerPopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                <FormattedMessage 
                    id="popupsupprimer.titre"
                    defaultMessage="Titre"
                    values={{nomEmprunt: props.nomEmprunt}}
                />
            </DialogTitle>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={() => props.onChangementOuvert(false)}>
                    <FormattedMessage 
                        id="popupsupprimer.boutonannuler"
                        defaultMessage="annuler"
                        values={{}}
                    />
                </Button>
                <Button variant="contained" color="error" onClick={() => supprimerEmprunt()} autoFocus>
                    <FormattedMessage 
                        id="popupsupprimer.boutonsupprimer"
                        defaultMessage="supprimer"
                        values={{}}
                    />
                </Button>
            </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
  }