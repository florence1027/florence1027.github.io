import React, { useState } from 'react';
import Francais from '../lang/fr.json'
import Anglais from '../lang/en.json'
import { MessageFormatError } from 'react-intl';


export type LangueContextType = {
  langue: string;
  setLangue: (nouvelleLangue: string) => void;
  messageLangue: any;
  setMessageLangue: (typeMessage: any) => void;
};


export const LangueContext = React.createContext<LangueContextType>({
  langue: 'fr',
  setLangue: () => {},
  messageLangue: Francais,
  setMessageLangue: () => {},
});

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