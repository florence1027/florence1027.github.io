import { useEffect, useState } from 'react';
import { FormLabel, FormControl, Button, Box, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid2 as Grid } from '@mui/material';
import { IEmprunt } from '../models/Emprunt';
import { getToken } from '../firebase';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface IFormulaireModifierEmprunt {
    idEmprunt: string | undefined;
    estOuvert: boolean;
    onChangementOuvert: (etat: boolean) => void;
    messageSnackbar: (text: string, severity: "success" | "error") => void;
}

/**
 * Afficher un popup qui contient un formulaire pour modifier un emprunt.
 * @param props Les paramètres du popup
 * @returns Le popup
 */
export default function PopupModifier(props: IFormulaireModifierEmprunt) {
    const intl = useIntl();
    const regexLivre = /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/;
    const [empruntActuel, setEmpruntActuel] = useState<IEmprunt>();
    const [nom, setNom] = useState(empruntActuel ? empruntActuel.nom : "");
    const [erreurNom, setErreurNom] = useState("");
    const [prenom, setPrenom] = useState(empruntActuel ? empruntActuel.prenom : "");
    const [erreurPrenom, setErreurPrenom] = useState("");
    const [age, setAge] = useState(empruntActuel ? empruntActuel.age : -1);
    const [erreurAge, setErreurAge] = useState("");
    const [numeroCompte, setNumeroCompte] = useState(empruntActuel ? empruntActuel.numeroCompte : -1);
    const [erreurNumeroCompte, setErreurNumeroCompte] = useState("");
    const [expirationCompte, setExpirationCompte] = useState(empruntActuel ? empruntActuel.expirationCompte.toString() : "");
    const [erreurExpirationCompte, setErreurExpirationCompte] = useState("");
    const [dateRetour, setDateRetour] = useState(empruntActuel ? empruntActuel.dateRetour.toString() : "");
    const [erreurDateRetour, setErreurDateRetour] = useState("");
    const [actif, setActif] = useState(empruntActuel ? empruntActuel.actif : false);
    const [livres, setLivres] = useState(empruntActuel ? empruntActuel.livres : ["","","","",""]);
    const [erreurLivres, setErreurLivres] = useState("");
    const [erreurLivreIndividuel, setErreurLivreIndividuel] = useState(["","","","",""]);
    const [ouvert, setOuvert] = useState(props.estOuvert);
    const [formulaireValide, setFormulaireValide] = useState(false);
    
    /**
     * Appel à l'API pour avoir les informations de l'emprunt
     */
    const fetchEmpruntsId = async () => {
        //setEmpruntActuel();
        const token = await getToken();

        const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts/'+ props.idEmprunt, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const data = await response.json();
        setEmpruntActuel(data.emprunt as IEmprunt);
        setNom(empruntActuel ? empruntActuel.nom : "");
        setPrenom(empruntActuel ? empruntActuel.prenom : "");
        setAge(empruntActuel ? empruntActuel.age : -1);
        setNumeroCompte(empruntActuel ? empruntActuel.numeroCompte : -1);
        setExpirationCompte(empruntActuel ? empruntActuel.expirationCompte.toString() : "");
        setDateRetour(empruntActuel ? empruntActuel.dateRetour.toString() : "");
        setActif(empruntActuel ? empruntActuel.actif : false);
        setLivres(empruntActuel ? empruntActuel.livres : ["","","","",""]);

        setOuvert(props.estOuvert);
    };

    useEffect(() => {
        fetchEmpruntsId();
        //setOuvert(props.estOuvert);
        
    }, [props.estOuvert]);
    
    const fermerPopup = () => {
        props.onChangementOuvert(false)
        //setOuvert(false);
    };

    /**
     * MÉTHODES DE VALIDATION
     */
    //Vérifier le nom
    const validerNom = (nom: string) => {
        if (nom == null || nom.length == 0) {
            setNom("");
            setErreurNom(intl.formatMessage({id: 'formulaireajout.erreurnom'}));
        }
        else {
            setNom(nom);
            setErreurNom("");
        }
    };
    //Vérifier le prénom
    const validerPrenom = (prenom: string) => {
        if (prenom == null || prenom.length == 0) {
            setPrenom("")
            setErreurPrenom(intl.formatMessage({id: 'formulaireajout.erreurprenom'}));
        }
        else {
            setPrenom(prenom);
            setErreurPrenom("");
        }
    };
    //Vérifier l'âge
    const validerAge = (age: number) => {
        if (age <= 0 || age == null || age > 120) {
            setAge(-1)
            setErreurAge(intl.formatMessage({id: 'formulaireajout.erreurage'}));
        }
        else {
            setAge(age);
            setErreurAge("");
        }
    };
    //Vérifier le numéro de compte
    const validerNumeroCompte = (numeroCompte: number) => {
        if (numeroCompte < 11111111 || numeroCompte > 99999999) {
            setNumeroCompte(-1);
            setErreurNumeroCompte(intl.formatMessage({id: 'formulaireajout.erreurnumerocompte'}));
        }
        else {
            setNumeroCompte(numeroCompte);
            setErreurNumeroCompte("");
        }
    };
    //Vérifier la date de retour
    const validerDateRetour = (dateRetour: Dayjs | null) => {
        if (dateRetour == null || dateRetour < dayjs()) {
            setDateRetour("01-01-1970");
            setErreurDateRetour(intl.formatMessage({id: 'formulairemodifier.erreurdateretour'}));
        }
        else {
            setDateRetour(dateRetour.format());
            setErreurDateRetour("");
        }
    };
    //Vérifier la date d'expiration du compte
    const validerExpirationCompte = (expirationCompte: Dayjs | null) => {
        if (expirationCompte == null || expirationCompte < dayjs()) {
            setExpirationCompte("01-01-1970");
            setErreurExpirationCompte(intl.formatMessage({id: 'formulaireajout.erreurexpirationcompte'}));
        }
        else {
            setExpirationCompte(expirationCompte.format());
            setErreurExpirationCompte("");
        }
    };
    //Vérifier qu'il y a des livres
    const validerLivres = (livres: string[]) => {
        var valide = false;
        for (var i = 0; i < livres.length; i++) {
            if (livres[i].length > 0) {
                valide = true;
                setErreurLivres("");
            }
        }
        if (!valide) {
            setErreurLivres(intl.formatMessage({id: 'formulaireajout.erreurlivres'}));
        }
    };
    //Vérifier les codes de livre
    const validerLivre = (livre: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) => {
        var index = Number(livre.name.toString().slice(-1));

        if (!regexLivre.test(livre.value) && livre.value.length != 0) {
            var copieErreurs = erreurLivreIndividuel.slice();
            copieErreurs[index] = intl.formatMessage({id: 'formulaireajout.erreurlivreindividuel'});
            setErreurLivreIndividuel(copieErreurs);
        }
        else {
            var copieLivres = livres;
            copieLivres[index] = livre.value;
            setLivres(copieLivres);
            var copieErreurs = erreurLivreIndividuel.slice();
            copieErreurs[index] = "";
            setErreurLivreIndividuel(copieErreurs);
        }

        validerLivres(livres);
    };

    /**
     * Rendre le bouton d'envoi du formulaire grisé s'il y a une erreur
     */
    useEffect(() => {
        if (nom && prenom && age != -1 && numeroCompte != -1 && expirationCompte && expirationCompte != "01-01-1970" && dateRetour && dateRetour != "01-01-1970" && livres.toString().length > 4 &&
        erreurLivres == "" && erreurLivreIndividuel.toString() == ",,,,"
        ) {
            setFormulaireValide(true);
        }
        else {
            setFormulaireValide(false);
        }
    }, [nom, prenom, age, numeroCompte, expirationCompte, dateRetour, erreurLivres, erreurLivreIndividuel, livres]);

    /**
     * Appel à l'api à l'envoi du formulaire pour enregistrer les modifications.
     * @param event L'événement d'envoi du formulaire
     */
    const envoyerFormulaire = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //Nouveau tableau pour éviter les virgules avant/après/doubles
        var nouveauLivres = [];
        for (var i = 0; i < livres.length; i++) {
            if (livres[i] != "") {
                nouveauLivres.push(livres[i]);
            }
        }

        const empruntModifie: IEmprunt = {
            _id: props.idEmprunt,
            nom: nom,
            prenom: prenom,
            age: age,
            numeroCompte: numeroCompte,
            expirationCompte: new Date(expirationCompte),
            dateRetour: new Date(dateRetour),
            actif: actif,
            livres: nouveauLivres,
        };

        const token = await getToken();
        //console.log(JSON.stringify({emprunt: empruntModifie}));
        try {
            const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts/', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({emprunt: empruntModifie}),
            });
            if (!response.ok) {
                props.messageSnackbar(response.statusText, "error");
                throw new Error(`Error: ${response.statusText}`);
            }
            //const data = await response.text()//await response.json();
            props.messageSnackbar("L'emprunt a été modifié avec succès", "success");
        } catch (error) {
            props.messageSnackbar("La requête n'a pas marché", "error");
            console.error('Request failed', error);
        } finally {
            
            //navigate('/')
        }
    };
    return (
        
        <Dialog
        open={ouvert}
        onClose={fermerPopup}
        PaperProps={{
            style: {
                backgroundColor: 'whiteSmoke',
                width: '75%',
                border: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'space-around'
                },
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            envoyerFormulaire(event);
          },
        }}
        >
            <Box display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            >
                <DialogTitle>
                    <FormattedMessage
                        id="formulairemodifier.titre"
                        defaultMessage="Titre"
                        values={{ }}
                    />
                </DialogTitle>

                <Grid container spacing={2} sx={{margin: 3, marginLeft: 5, justifyContent:'center', alignItems:'center'}}>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.nom"
                            defaultMessage="nom"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField 
                            type='text'
                            autoFocus
                            size="small"
                            defaultValue={nom}
                            helperText={erreurNom}
                            error={erreurNom != ""}
                            onChange={(e) => validerNom(e.target.value)}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.prenom"
                            defaultMessage="prenom"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField
                            type="text"
                            size="small"
                            defaultValue={prenom}
                            helperText={erreurPrenom}
                            error={erreurPrenom != ""}
                            onChange={(e) => validerPrenom(e.target.value)}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.age"
                            defaultMessage="age"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField
                            type="number"
                            sx={{width: '75%'}}
                            variant="standard"
                            size="small"
                            defaultValue={age}
                            helperText={erreurAge}
                            error={erreurAge != ""}
                            onChange={(e) => validerAge(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.numerocompte"
                            defaultMessage="numerocompte"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField
                            type="number"
                            sx={{width: '75%'}}
                            variant="standard"
                            size="small"
                            defaultValue={numeroCompte}
                            helperText={erreurNumeroCompte}
                            error={erreurNumeroCompte != ""}
                            onChange={(e) => validerNumeroCompte(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.expirationcompte"
                            defaultMessage="expiration"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                defaultValue={dayjs(expirationCompte)}
                                disablePast
                                sx={{input: {height: '10px'}}}
                                onChange={(e) => validerExpirationCompte(e)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                        <FormLabel error={true}>{erreurExpirationCompte}</FormLabel>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulairemodifier.dateretour"
                            defaultMessage="retour"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                defaultValue={dayjs(dateRetour)}
                                disablePast
                                sx={{input: {height: '10px'}}}
                                maxDate={dayjs(expirationCompte)}
                                onChange={(e) => validerDateRetour(e)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                        <FormLabel error={true}>{erreurDateRetour}</FormLabel>
                    </Grid>
                    <Grid size={4} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulairemodifier.actif"
                            defaultMessage="actif"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={8} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <input
                            type="checkbox"
                            defaultChecked={actif}
                            onChange={(e) => setActif(e.target.checked)}
                        />
                    </Grid>
                    <Grid size={12} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                        <FormattedMessage
                            id="formulaireajout.livres"
                            defaultMessage="livres"
                            values={{ }}
                        />
                        <Typography variant="caption">
                            <FormattedMessage
                                id="formulaireajout.formatlivre"
                                defaultMessage="978-1-162-28190-5"
                                values={{ }}
                            />
                        </Typography>
                        <Grid container spacing={2} sx={{display: 'flex', flexDirection:'row', alignItems:'center'}}>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}></Grid>
                            <Grid size={6} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                                <TextField
                                    type="text"
                                    size="small"
                                    margin="none"
                                    defaultValue={livres[0]}
                                    name="livre0"
                                    helperText={erreurLivreIndividuel[0]}
                                    error={erreurLivreIndividuel[0] != ""}
                                    onChange={(e) => validerLivre(e.target)}
                                />
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}></Grid>
                            <Grid size={6} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                                <TextField
                                    type="text"
                                    size="small"
                                    margin="none"
                                    defaultValue={livres[1]}
                                    name="livre1"
                                    disabled={!livres[0]}
                                    helperText={erreurLivreIndividuel[1]}
                                    error={erreurLivreIndividuel[1] != ""}
                                    onChange={(e) => validerLivre(e.target)}
                                />
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}></Grid>
                            <Grid size={6} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                                <TextField
                                    type="text"
                                    size="small"
                                    margin="none"
                                    defaultValue={livres[2]}
                                    name="livre2"
                                    disabled={!livres[1]}
                                    helperText={erreurLivreIndividuel[2]}
                                    error={erreurLivreIndividuel[2] != ""}
                                    onChange={(e) => validerLivre(e.target)}
                                />
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}></Grid>
                            <Grid size={6} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                                <TextField
                                    type="text"
                                    size="small"
                                    margin="none"
                                    defaultValue={livres[3]}
                                    name="livre3"
                                    disabled={!livres[2]}
                                    helperText={erreurLivreIndividuel[3]}
                                    error={erreurLivreIndividuel[3] != ""}
                                    onChange={(e) => validerLivre(e.target)}
                                />
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}></Grid>
                            <Grid size={6} sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                                <TextField
                                    type="text"
                                    size="small"
                                    margin="none"
                                    defaultValue={livres[4]}
                                    name="livre4"
                                    disabled={!livres[3]}
                                    helperText={erreurLivreIndividuel[4]}
                                    error={erreurLivreIndividuel[4] != ""}
                                    onChange={(e) => validerLivre(e.target)}
                                />
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                            </Grid>
                        </Grid>
                        <FormLabel error={true}>{erreurLivres}</FormLabel>
                        
                    </Grid>
                    <Grid size={12} sx={{display: 'flex', justifyContent:'center'}}>
                        <FormControl>
                            <Button onClick={() => props.onChangementOuvert(false)} variant="contained" color="error">
                                <FormattedMessage
                                    id="formulairemodifier.boutonannuler"
                                    defaultMessage="annuler"
                                    values={{ }}
                                />
                            </Button>
                        </FormControl>
                        &nbsp;
                        <FormControl>
                            <Button disabled={!formulaireValide} type="submit" variant="contained" color="success">
                                <FormattedMessage
                                    id="formulairemodifier.boutonmodifier"
                                    defaultMessage="modifier"
                                    values={{ }}
                                />
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    )
}