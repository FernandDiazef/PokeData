import React from 'react';
import './search.css'

const SearchInput = ({ setSearched , searched, loading }) => {


    return (
        <>
            <h1 className='text-info shadow'>PokeDate</h1>
            <input type='text' placeholder='busca un pokemon' disabled={loading} value={searched} onChange={(e) => setSearched(e.target.value)} className='mt-3 class_input' />
        </>
    );
}

export { SearchInput };