export type IEmprunt = {
    nom: string;
    prenom: string;
    age: number;
    numeroCompte: number;
    expirationCompte: Date;
    dateRetour: Date;
    actif: boolean;
    livres: string[];
    _id?: string;
};