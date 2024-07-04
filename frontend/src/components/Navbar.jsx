import React from 'react';

const Navbar = ({ address }) => {
    return (
        <div>
            <nav className="w-[95vw] h-20 bg-transparent border-2 border-gray-200 rounded-2xl relative backdrop-blur-lg backdrop-opacity-30 flex justify-between items-center px-10">
                <div className="absolute inset-0 bg-opacity-30 blur-md rounded-full"> </div>
                <div className="font-bold text-3xl">Lottery</div>
                <div>{address ? address : "Not connected"}</div>
            </nav>
        </div>
    );
}

export default Navbar;
