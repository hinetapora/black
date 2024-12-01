// app/dashboard/accounts/page.tsx
'use client';

import React from 'react';
import { Accounts } from '@/components/dashboard/accounts/index';
import { AddUser } from '@/components/dashboard/accounts/add-user';
import { Button } from '@nextui-org/react';

const AccountsPage = () => {
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);

  const handleOpenAddUser = () => setIsAddUserOpen(true);
  const handleCloseAddUser = () => setIsAddUserOpen(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User Accounts</h1>
        <Button color="primary" onPress={handleOpenAddUser}>
          Add New User
        </Button>
      </div>
      <Accounts />
      <AddUser isOpen={isAddUserOpen} onClose={handleCloseAddUser} />
    </div>
  );
};

export default AccountsPage;