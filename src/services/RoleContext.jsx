import React, { createContext, useState } from 'react';

// สร้าง Context
export const RoleContext = createContext();

// สร้าง Provider เพื่อแชร์ Role ของผู้ใช้
export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(''); // เริ่มต้นด้วย guest

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};
