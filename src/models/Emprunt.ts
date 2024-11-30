export type IEmprunt = {
    nom: string;
    prenom: string;
    age: number;
    numeroCompte: number;
    expirationCompte: Date;
    dateRetour: Date;
    actif: boolean;
    livres: string[]; //Si il y a un problème, essayer [String]
    _id?: string;
};