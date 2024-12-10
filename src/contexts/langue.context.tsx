import React, { useState } from 'react';
import Francais from '../lang/fr.json'
//import Anglais from '../lang/en.json'


export type LangueContextType = {
  langue: string;
  setLangue: (nouvelleLangue: string) => void;
  messageLangue: any;
  setMessageLangue: (typeMessage: any) => void;
};


/**
 * Contexte de langue
 * Sers à changer la langue du site.
 */
export const LangueContext = React.createContext<LangueContextType>({
  langue: 'fr',
  setLangue: () => {},
  messageLangue: Francais,
  setMessageLangue: () => {},
});

/**
 * Retourner le contexte de langue
 * @param props Les paramètres du Provider
 * @returns Le context provider
 */
export default function LangueProvider(props: any) {
  const [langue, setLangue] = useState('fr');
  const [messageLangue, setMessageLangue] = useState(Francais);
  const values = {
    langue,
    setLangue,
    messageLangue,
    setMessageLangue,
  };
  return (
    <LangueContext.Provider value={values}>
      {props.children}
    </LangueContext.Provider>
  );
}