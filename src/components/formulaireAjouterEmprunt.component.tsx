import { useEffect } from 'react';
import { FormLabel, FormControl, Button, Box, Card, TextField } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { IEmprunt } from '../models/Emprunt';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, } from '../firebase';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';
import { useIntl } from 'react-intl'
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/**
 * Formulaire pour ajouter un emprunt
 * @returns La vue du formulaire
 */
export default function FormulaireAjouterEmprunt() {
    const intl = useIntl();
    const navigate = useNavigate();
    const regexLivre = /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/;
    const [nom, setNom] = useState("");
    const [erreurNom, setErreurNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [erreurPrenom, setErreurPrenom] = useState("");
    const [age, setAge] = useState(0);
    const [erreurAge, setErreurAge] = useState("");
    const [numeroCompte, setNumeroCompte] = useState(0);
    const [erreurNumeroCompte, setErreurNumeroCompte] = useState("");
    const [expirationCompte, setExpirationCompte] = useState("");
    const [erreurExpirationCompte, setErreurExpirationCompte] = useState("");
    const [livres, setLivres] = useState([""]);
    const [erreurLivres, setErreurLivres] = useState("");
    const [erreurLivreIndividuel, setErreurLivreIndividuel] = useState(["","","","",""]);
    const [formulaireValide, setFormulaireValide] = useState(false);
    const [erreurAjout, setErreurAjout] = useState("");

    /**
     * MÉTHODES DE VALIDATION
     */
    //Valider le nom
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
    //Valider le prénom
    const validerPrenom = (prenom: string) => {
        if (prenom == null || prenom.length == 0) {
            setPrenom("");
            setErreurPrenom(intl.formatMessage({id: 'formulaireajout.erreurprenom'}));
        }
        else {
            setPrenom(prenom);
            setErreurPrenom("");
        }
    };
    //Valider l'âge
    const validerAge = (age: number) => {
        if (age <= 0 || age == null) {
            setAge(-1);
            setErreurAge(intl.formatMessage({id: 'formulaireajout.erreurage'}));
        }
        else {
            setAge(age);
            setErreurAge("");
        }
    };
    //Valider le numéro de compte
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
    //Valider l'expiration du compte
    const validerExpirationCompte = (expirationCompte: Dayjs | null) => {
        //Si elle est dans le passé
        if (expirationCompte == null || expirationCompte < dayjs()) {
            setExpirationCompte("01-01-1970");
            setErreurExpirationCompte(intl.formatMessage({id: 'formulaireajout.erreurexpirationcompte'}));
        }
        //Sinon, on veut avoir 14 jours entre la date d'aujourd'hui et la date d'expiration du compte pour que la date de retour prévue soit avant cette expiration
        else if (expirationCompte < dayjs().add(14,'day')) {
            setExpirationCompte("01-01-1970");
            setErreurExpirationCompte(intl.formatMessage({id: 'formulaireajout.erreurexpirationcompteretour'}));
        }
        else {
            setExpirationCompte(expirationCompte.format());
            setErreurExpirationCompte("");
        }
    };
    //Valider qu'il y a des livres
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
    //Valider les codes des livres
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
     * Désactiver le bouton d'envoi du formulaire s'il y a une erreur
     */
    useEffect(() => {
        if (nom && prenom && age != -1 && numeroCompte != -1 && expirationCompte && expirationCompte != "01-01-1970" && livres.toString().length > 4 &&
        erreurLivres == "" && erreurLivreIndividuel.toString() == ",,,,"
        ) {
            setFormulaireValide(true);
        }
        else {
            setFormulaireValide(false);
        }
    }, [nom, prenom, age, numeroCompte, expirationCompte, erreurLivres, erreurLivreIndividuel, livres]);

    /**
     * Envoyer le formulaire et appel à l'api pour enregistrer le nouvel emprunt
     * @param event L'événement d'envoi du formulaire
     */
    const envoyerFormulaire = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //La date de retour d'un emprunt est normalement 2 semaines après
        var datePourCalcul = new Date();
        datePourCalcul.setDate(datePourCalcul.getDate()+14);

        //Nouveau tableau pour éviter les virgules avant/après/doubles
        var nouveauLivres = [];
        for (var i = 0; i < livres.length; i++) {
            if (livres[i] != "") {
                nouveauLivres.push(livres[i]);
            }
        }
        const emprunt: IEmprunt = {
            nom: nom,
            prenom: prenom,
            age: age,
            numeroCompte: numeroCompte,
            expirationCompte: new Date(expirationCompte),
            dateRetour: datePourCalcul,
            actif: true,
            livres: nouveauLivres,
        };
        const token = await getToken();
        try {
            const response = await fetch('https://projet-integrateur-web3-api.onrender.com/api/emprunts/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({emprunt: emprunt}),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            await response.json();

            if (response.ok) {
                navigate('/')
            }
            else {
                setErreurAjout("Il y a eu une erreur lors de l'ajout de l'emprunt");
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    };


    return (
        <Box
            component="form"
            noValidate
            onSubmit={envoyerFormulaire}
            sx={{ mt: -5 }}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
        >
            <Typography margin={3} variant="h2" sx={{backgroundColor: 'red'}}>{erreurAjout}</Typography>
            <Typography variant="h2">
                <FormattedMessage
                    id="formulaireajout.titre"
                    defaultMessage="Titre"
                    values={{ }}
                />
            </Typography>
            <Button onClick={() => navigate('/')} variant="contained">
                <FormattedMessage
                    id="formulaireajout.boutonretour"
                    defaultMessage="Retour"
                    values={{ }}
                />
            </Button>
            <p></p>
            <Card sx={{width: '100%', backgroundColor: 'whitesmoke'}}>
                <Grid container spacing={2} sx={{margin: 3}} alignItems={'center'}>
                    
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.nom"
                            defaultMessage="nom"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={7} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField 
                            type='text'
                            autoFocus
                            size="small"
                            helperText={erreurNom}
                            error={erreurNom != ""}
                            onChange={(e) => validerNom(e.target.value)}
                        />
                    </Grid>
                    
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.prenom"
                            defaultMessage="prenom"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={7} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField
                            type="text"
                            size="small"
                            helperText={erreurPrenom}
                            error={erreurPrenom != ""}
                            onChange={(e) => validerPrenom(e.target.value)}
                        />
                    </Grid>
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.age"
                            defaultMessage="age"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField
                            type="number"
                            sx={{width: '40%'}}
                            variant="standard"
                            size="small"
                            helperText={erreurAge}
                            error={erreurAge != ""}
                            //min={0}
                            //max={120}
                            onChange={(e) => validerAge(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={2}></Grid>
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.numerocompte"
                            defaultMessage="numerocompte"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <TextField
                            type="number"
                            sx={{width: '40%'}}
                            variant="standard"
                            size="small"
                            helperText={erreurNumeroCompte}
                            error={erreurNumeroCompte != ""}
                            //min={0}
                            //max={99999999}
                            onChange={(e) => validerNumeroCompte(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={2}></Grid>
                    <Grid size={5} sx={{display: 'flex', flexDirection:'column', alignItems:'end', textAlign:'end'}}>
                        <FormattedMessage
                            id="formulaireajout.expirationcompte"
                            defaultMessage="expiration"
                            values={{ }}
                        />
                    </Grid>
                    <Grid size={7} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disablePast
                                
                                sx={{input: {height: '10px'}}}
                                onChange={(e) => validerExpirationCompte(e)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={12} sx={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent: 'center'}}>
                        <FormLabel sx={{fontSize: 12, textAlign: 'center'}} error={true}>{erreurExpirationCompte}</FormLabel>
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
                                    name="livre3"
                                    disabled={!livres[3]}
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
                                    disabled={!livres[4]}
                                    helperText={erreurLivreIndividuel[4]}
                                    error={erreurLivreIndividuel[4] != ""}
                                    name="livre4"
                                    onChange={(e) => validerLivre(e.target)}
                                />
                            </Grid>
                            <Grid size={3} sx={{display: 'flex', flexDirection:'column', alignItems:'start'}}>
                            </Grid>
                        </Grid>
                        <FormLabel sx={{fontSize: 12, textAlign: 'center'}} error={true}>{erreurLivres}</FormLabel>
                        
                    </Grid>
                    <Grid size={12}>
                            <FormControl>
                                <Button onClick={() => navigate('/')} variant="contained" color="error">
                                    <FormattedMessage
                                        id="formulaireajout.boutonannuler"
                                        defaultMessage="Annuler"
                                        values={{ }}
                                    />
                                </Button>
                            </FormControl>
                            &nbsp;
                            <FormControl>
                                <Button disabled={!formulaireValide} type="submit" variant="contained" color="success">
                                    <FormattedMessage
                                        id="formulaireajout.boutonajouter"
                                        defaultMessage="Ajouter"
                                        values={{ }}
                                    />
                                </Button>
                            </FormControl>
                        </Grid>
                </Grid>
            </Card>
        </Box>
    )
}