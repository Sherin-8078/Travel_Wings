import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, UserX, UserCheck } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Block User
  const handleBlock = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/block-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error blocking user:", err);
      alert("Failed to block user");
    }
  };

  // ✅ Unblock User
  const handleUnblock = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/unblock-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error unblocking user:", err);
      alert("Failed to unblock user");
    }
  };

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`);
      setUsers(users.filter((u) => u._id !== id)); // Optimistic update
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading users...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      u.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-2">
                  {u.status === "active" ? (
                    <button
                      onClick={() => handleBlock(u._id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md flex items-center gap-1 hover:bg-yellow-600"
                    >
                      <UserX size={16} /> Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(u._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center gap-1 hover:bg-green-700"
                    >
                      <UserCheck size={16} /> Unblock
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center gap-1 hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="p-4 text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
}
