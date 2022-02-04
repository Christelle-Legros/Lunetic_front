import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CurrentOpticianContext from '../contexts/CurrentOptician';
import IInfoWishlist from '../interfaces/IInfoWishlist';
import IWishlist from '../interfaces/IWishlist';

type Props = {
  name: string;
  idWishlist: number;
  edit: boolean;
  editFinished: boolean;
  setEditFinished: Function;
  wishlistDeleted: boolean;
  setWishlistDeleted: Function;
};

const NameWishlist: React.FC<Props> = ({
  name,
  idWishlist,
  edit,
  editFinished,
  setEditFinished,
  wishlistDeleted,
  setWishlistDeleted,
}) => {
  const { idOptician } = useContext(CurrentOpticianContext);

  const [newNameWishlist, setNewNameWishlist] = useState<string>(name);
  const [editName, setEditName] = useState<boolean>(false);
  const [listGlasses, setListGlasses] = useState<IInfoWishlist[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/models-wishlist/wishlists/${idWishlist}`)
      .then((res) => res.data)
      .then((data) => setListGlasses(data));
  }, []);

  const updateNameWishlist = () => {
    axios.put(
      `http://localhost:4000/api/wishlists/${idWishlist}`,
      {
        name: newNameWishlist,
      },
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
  };

  const deleteWishlist = () => {
    listGlasses.map((glasses) =>
      axios.delete(
        `http://localhost:4000/api/models-wishlist/${glasses.id_model_temple_color}`,
      ),
    );
    axios.delete(`http://localhost:4000/api/wishlists/${idWishlist}`);
  };

  return (
    <div className="name-wishlist">
      <div className="name-wishlist__container">
        {editName ? (
          <div className="name-wishlist__list name-wishlist__edit">
            <input
              type="text"
              value={newNameWishlist}
              onChange={(e) => setNewNameWishlist(e.target.value)}
            />
          </div>
        ) : (
          <Link to={`/opticians/${idOptician}/wishlists/${idWishlist}`} key={idWishlist}>
            <div className="name-wishlist__list">{name}</div>
          </Link>
        )}
        {edit && (
          <input
            className="name-wishlist__btn-edit"
            type="button"
            value={editName ? 'Valider' : 'Modifier'}
            onClick={() => {
              setEditName(!editName);
              if (editName) {
                updateNameWishlist();
                setEditFinished(!editFinished);
              }
            }}
          />
        )}
        {edit && (
          <input
            className="name-wishlist__btn-remove"
            type="button"
            value="Supprimer"
            onClick={() => {
              deleteWishlist();
              setWishlistDeleted(!wishlistDeleted);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NameWishlist;