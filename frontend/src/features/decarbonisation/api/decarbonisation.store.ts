import { atom, useAtom } from 'jotai';
import { Decarbonisation } from '../components/decarbonisation.item';

export type DecarbonisationStore = {
  decarbonisations: Decarbonisation[];
  addDecarbonisation: (decarbonisation: Decarbonisation) => void;
  removeDecarbonisation: (uuid: string) => void;
  hasDecarbonisation: (uuid: string) => boolean;
};

const decarbonisationsAtom = atom<Decarbonisation[]>([]);
const addDecarbonisationAtom = atom(
  null,
  (get, set, decarbonisation: Decarbonisation) => {
    set(decarbonisationsAtom, [...get(decarbonisationsAtom), decarbonisation]);
  },
);

const removeDecarbonisationAtom = atom(null, (get, set, uuid: string) => {
  set(
    decarbonisationsAtom,
    get(decarbonisationsAtom).filter(
      (decarbonisation) => decarbonisation.uuid !== uuid,
    ),
  );
});

const hasDecarbonisationAtom = atom(null, (get, set, uuid: string) => {
  return get(decarbonisationsAtom).some(
    (decarbonisation) => decarbonisation.uuid === uuid,
  );
});

export function useDecarbonisationStore(): DecarbonisationStore {
  const [decarbonisations] = useAtom(decarbonisationsAtom);
  const [, addDecarbonisation] = useAtom(addDecarbonisationAtom);
  const [, removeDecarbonisation] = useAtom(removeDecarbonisationAtom);
  const [, hasDecarbonisation] = useAtom(hasDecarbonisationAtom);

  return {
    decarbonisations,
    addDecarbonisation,
    removeDecarbonisation,
    hasDecarbonisation,
  };
}
