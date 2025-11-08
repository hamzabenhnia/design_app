import React, { useEffect } from "react";
import UserCard from "../components/Users";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/actions/userActions";

export default function UserList() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    alert(`Modifier ${user.name}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Supprimer ${user.name} ?`)) {
      alert(`Supprimer ${user.name}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Liste des utilisateurs 👥
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {users.map((u) => (
          <UserCard
            key={u.id}
            name={u.name}
            email={u.email}
            role={u.role}
            avatar={u.avatar}
            onEdit={() => handleEdit(u)}
            onDelete={() => handleDelete(u)}
          />
        ))}
      </div>
    </div>
  );
}