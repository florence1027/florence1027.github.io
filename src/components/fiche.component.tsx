import { useState } from 'react';
import { Card } from '@mui/material';;
import { CardContent } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { IEmprunt } from '../models/Emprunt';
import PopupSupprimer from './popupSupprimer.component';
import PopupModifier from './popupModifier.component';
import { FormattedMessage } from 'react-intl';
import { FormattedDate } from 'react-intl';
interface IFiche {
  emprunt: IEmprunt;
  messageSnackbar: (text: string, severity: "success" | "error") => void;
}

export default function Fiche(props: IFiche) {
  const [popupSupprimerOuvert, setPopupSupprimerOuvert] = useState(false);
  const [popupModifierOuvert, setPopupModifierOuvert] = useState(false);
  //const navigate = useNavigate();
  const confirmerSuppression = () => {
    setPopupSupprimerOuvert(true);
  };
  const modifier = () => {
    setPopupModifierOuvert(true);
  }

  var listeEmpruntsPleine = props.emprunt.livres.slice();
  while (listeEmpruntsPleine.length != 5) {
    listeEmpruntsPleine.push("  ");
  }

  return (
    <Card sx={{ width: 300, maxWidth: 300, height: 350, maxHeight: 350 }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <FormattedMessage 
            id="fiche.empruntcompte"
            defaultMessage="Titre"
            values={{ numeroCompte: props.emprunt.numeroCompte }}
          />
        </Typography>
        <Typography variant="body2"color={props.emprunt.actif ? "green" : "gray"} >
          <FormattedMessage
            id="fiche.actif"
            defaultMessage="Titre"
            values={{actif: props.emprunt.actif }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage 
            id="fiche.nomage"
            defaultMessage="Titre"
            values={{ prenom: props.emprunt.prenom, nom: props.emprunt.nom, age: props.emprunt.age }}
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage 
            id="fiche.expirationcompte"
            defaultMessage="Titre"
            values={{ }}
          />
          <FormattedDate 
           value={props.emprunt.expirationCompte}
           year="numeric"
           month="long"
           day="2-digit"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage
            id="fiche.dateretour"
            defaultMessage="Titre"
            values={{ }}
          />
          <FormattedDate 
           value={props.emprunt.dateRetour}
           year="numeric"
           month="long"
           day="2-digit"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" >
          <FormattedMessage
            id="fiche.livres"
            defaultMessage="Titre"
            values={{}}
          />
         </Typography>
        {listeEmpruntsPleine &&
          listeEmpruntsPleine.map((livre, index) => {
          
          return (
            <Typography variant="body2" color="text.secondary" key={index}>{livre}&nbsp;</Typography>
          );
        })}
        <Button sx={{width: '45%'}} variant="outlined" color='error' onClick={confirmerSuppression}>
          <FormattedMessage
            id="fiche.boutonsupprimer"
            defaultMessage="Titre"
            values={{ }}
          />
        </Button>
        &nbsp;
        <Button sx={{width: '45%'}} variant="outlined" onClick={modifier}>
          <FormattedMessage
            id="fiche.boutonmodifier"
            defaultMessage="Titre"
            values={{}}
          />
        </Button>
        
      </CardContent>
      <PopupSupprimer 
        estOuvert={popupSupprimerOuvert}
        idEmprunt={props.emprunt._id}
        nomEmprunt={props.emprunt.prenom + " " + props.emprunt.nom}
        messageSnackbar={(text, severity) => props.messageSnackbar(text, severity)}
        onChangementOuvert={()=>setPopupSupprimerOuvert(false)}
      >
      </PopupSupprimer>
      <PopupModifier
        estOuvert={popupModifierOuvert}
        emprunt={props.emprunt}
        messageSnackbar={(text, severity) => props.messageSnackbar(text, severity)}
        onChangementOuvert={() => setPopupModifierOuvert(false)}
      ></PopupModifier>
    </Card>
  );
}