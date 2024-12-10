import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import FormulaireAjouterEmprunt from '../components/formulaireAjouterEmprunt.component';
import { useNavigate } from 'react-router-dom';
/**
 * Page qui affiche un formulaire pour ajouter un emprunt.
 */
export const AjouterEmpruntRoute = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        // si loading = true, ça veut dire que le firebase n'est pas encore prêt.
        if (loading) return;
        // si user est null, l'utilisateur n'est pas authentifié
        if (!user) navigate('/login');

    }, [user, loading]);

    return <FormulaireAjouterEmprunt />;
};