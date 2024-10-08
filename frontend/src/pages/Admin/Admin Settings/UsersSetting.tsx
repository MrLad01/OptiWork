import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

export const UsersSetting = () => {
  const { users, setUsers } = useAuth();

  const [showMakeAdminModal, setShowMakeAdminModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleMakeAdmin = () => {
    if (selectedUserId) {
      axios.patch(`/api/user/make-admin/${selectedUserId}`)
        .then(() => {
          alert('User has been made an admin');
          setShowMakeAdminModal(false);
        })
        .catch((error) => {
          console.error('Error making user an admin:', error);
        });
    }
  };

  const handleDeleteUser = () => {
    if (selectedUserId) {
      axios.delete(`/api/users/${selectedUserId}`)
        .then(() => {
          alert('User has been deleted');
          setUsers(users && users.filter(user => user._id !== selectedUserId)); // Update the UI
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    }
  };

  return (
    <div className="w-full h-full p-3 bg-white rounded-md">
      <h1 className="text-base font-semibold">Users Setting</h1>
      
      <table className="w-full table-auto text-sm border-collapse mt-4">
        <thead>
          <tr>
            <th className="border text-sm px-4 py-2">First Name</th>
            <th className="border text-sm px-4 py-2">Last Name</th>
            <th className="border text-sm px-4 py-2">Username</th>
            <th className="border text-sm px-4 py-2">Company</th>
            <th className="border text-sm px-4 py-2">Role</th>
            <th className="border text-sm px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          { users && users.map((user) => (
            <tr key={user._id}>
              <td className="border text-sm px-4 py-2">{user.first_name}</td>
              <td className="border text-sm px-4 py-2">{user.last_name}</td>
              <td className="border text-sm px-4 py-2">{user.username}</td>
              <td className="border text-sm px-4 py-2">{user.company_name}</td>
              <td className="border text-sm px-4 py-2">{user.role}</td>
              <td className="border text-sm px-4 py-2">
                <div className="flex items-center justify-center">

                  <button
                    className="bg-slate-400 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setShowMakeAdminModal(true);
                    }}
                  >
                    Make Admin
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 ml-2 rounded"
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Make Admin Modal */}
      {showMakeAdminModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white py-6 px-20 rounded-lg">
            <h2 className="text-xl font-semibold">Confirm Make Admin</h2>
            <p className='font-light' > Are you sure you want to make this user an admin?</p>
            <div className="mt-6">
              <button
                className="bg-slate-600 text-white text-base px-3 py-2 rounded mr-2"
                onClick={handleMakeAdmin}
              >
                Yes, admin
              </button>
              <button
                className="bg-gray-100 text-base border px-3 py-2 rounded"
                onClick={() => setShowMakeAdminModal(false)}
              >
                No, boss, let's go back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-4">
              <button
                className="bg-red-500 text-white px-5 py-2 rounded mr-2"
                onClick={handleDeleteUser}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 px-5 py-2 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
