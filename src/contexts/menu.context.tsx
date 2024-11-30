import React, { useState } from 'react';



export type PanierContextType = {
  panierOuvert: boolean;
  setPanierOuvert: (ouvert: boolean) => void;
};


export const PanierContext = React.createContext<PanierContextType>({
  panierOuvert: false,
  setPanierOuvert: () => {},
});

export default function PanierProvider(props: any) {
  const [panierOuvert, setPanierOuvert] = useState(false);

  const values = {
    panierOuvert,
    setPanierOuvert,
  };
  return (
    <PanierContext.Provider value={values}>
      {props.children}
    </PanierContext.Provider>
  );
}
