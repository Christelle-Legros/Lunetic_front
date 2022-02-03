import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CurrentOpticianContext from '../contexts/CurrentOptician';
import IWishlist from '../interfaces/IWishlist';

type Props = {
  setShowModal: Function;
  addModelInWishlist: Function;
  idColorModel: number;
};

const ModalWishlists: React.FC<Props> = ({
  setShowModal,
  addModelInWishlist,
  idColorModel,
}) => {
  const [listWishlists, setListWishlists] = useState<IWishlist[]>();
  const [nameWishlist, setNameWishlist] = useState<string>('');
  const { idOptician } = useContext(CurrentOpticianContext);
  const [clicked, setClicked] = useState<boolean>(false);

  const d = new Date();

  // Function to format the date like YYYY-MM-DD HH:MM:SS
  const dformat =
    [
      d.getFullYear(),
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1,
      d.getDate(),
    ].join('-') +
    ' ' +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/opticians/${idOptician}/wishlists`)
      .then((res) => res.data)
      .then((data) => setListWishlists(data));
  }, [clicked]);

  // Create a wishlist and add the model directly to this wishlist
  const createWishlist = () => {
    axios
      .post('http://localhost:4000/api/wishlists', {
        id_optician: idOptician,
        name: nameWishlist,
        date: dformat,
      })
      .then((res) => res.data)
      .then((data) => addModelInWishlist(data.id_wishlist));
  };

  const toastAddingModelInWishlist = () => {
    toast.success('Modèle ajouter à la liste de souhaits', {
      autoClose: 3000,
      pauseOnHover: true,
    });
  };

  return (
    <>
      {idColorModel === 0 ? (
        <div className="modalWishlists">
          <div className="modalWishlists__container">
            <div
              className="modal-info__close"
              onClick={() => setShowModal(false)}
              onKeyPress={() => setShowModal(false)}
              tabIndex={0}
              role="button"
              aria-pressed="false">
              <p>Fermer</p>
            </div>
            <p className="modalWishlists__error">
              Merci de sélectionner une couleur avant de l&apos;ajouter à une liste de
              souhaits.
            </p>
          </div>
        </div>
      ) : (
        <div className="modalWishlists">
          <div className="modalWishlists__container">
            <div
              className="modal-info__close"
              onClick={() => setShowModal(false)}
              onKeyPress={() => setShowModal(false)}
              tabIndex={0}
              role="button"
              aria-pressed="false">
              <p>Fermer</p>
            </div>
            <h2>Ajouter la monture à une nouvelle liste de souhaits ?</h2>
            <div className="modalWishlists__input">
              <input
                type="text"
                name="name-wishlist"
                placeholder="Nom de ma liste de souhaits"
                value={nameWishlist}
                onChange={(e) => setNameWishlist(e.target.value)}
              />
              <button
                onClick={() => {
                  createWishlist();
                  setNameWishlist('');
                  setClicked(!clicked);
                  toastAddingModelInWishlist();
                }}>
                Valider
              </button>
            </div>
            <h2>Ajouter la monture à une liste de souhaits déjà existante</h2>
            <div className="modalWishlists__list">
              {listWishlists &&
                listWishlists.map((wishlist) => (
                  <p
                    key={wishlist.id_wishlist}
                    className="modalWishlists__name-wishlist"
                    onClick={() => {
                      addModelInWishlist(wishlist.id_wishlist);
                      toastAddingModelInWishlist();
                    }}
                    onKeyPress={() => {
                      addModelInWishlist(wishlist.id_wishlist);
                      toastAddingModelInWishlist();
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed="false">
                    {wishlist.name}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalWishlists;
