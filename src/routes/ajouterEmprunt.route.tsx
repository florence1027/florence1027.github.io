import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import FormulaireAjouterEmprunt from '../components/formulaireAjouterEmprunt.component';

export const AjouterEmpruntRoute = () => {
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        // si loading = true, ça veut dire que le firebase n'est pas encore prêt.
        //if (loading) return;
        // si user est null, l'utilisateur n'est pas authentifié
        //if (!user) navigate('/login');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading]);

    return <FormulaireAjouterEmprunt />;
};