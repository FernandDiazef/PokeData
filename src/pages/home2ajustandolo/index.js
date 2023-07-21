import React, { useEffect, useState } from 'react';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Instance } from '../../API/api';
import { SearchInput } from '../../components/searchInput/searchInput';

const index = () => {

    const [list, setList] = useState([]);
    const [generation1, setGeneration1] = useState([]);
    const [searched, setSearched] = useState('');
    const [copia, setCopia] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({ active: false, errors: [] });
    const [pagination1, setPagination1] = useState(1);

    const Buscar = async (text) => {

        let copia1;
        copia1 = [...list];

        try {
            const response = await Instance.get(`pokemon/${searched.toLowerCase()}/`);
            if (list.length > 1) {
                setCopia(list);
            }
            setList([response.data]);
        } catch (e) {
            alert('El pokemon no exite');
            if (copia1.length > 1) {
                setList(copia1)
            } else {
                setList(copia)
                setCopia([])
            }
            setSearched('');
        }
    }

    const paginationNext = async () => {
        try {
            setList([]);
            setError({ active: false, errors: [] });
            setLoading(true);

            let limitNumberStart = 30;
            let start = pagination1;
            let limit = pagination1 + limitNumberStart;

            let info = [];
            let gen = [];

            if (limit > 800) {
                limit = 807
            }

            for (start; start <= limit; start++) {
                let response = await Instance.get(`pokemon/${start}`);
                let response2 = await Instance.get(`item/${start}`);

                gen.push(response2.data);
                info.push(response.data);
            }

            setPagination1(limit);
            setLoading(false);
            setGeneration1(gen);
            setList(info);

        } catch (e) {
            setError(
                {
                    active: true,
                    errors: ['Fallo la peticion al servidor, intente de nuevo']
                });
            setLoading(false);
        }
    }

    const paginationPrev = async () => {
        try {
            setList([])
            setError({ active: false, errors: [] });
            setLoading(true);

            let limitNumberStart = 30;
            let start = pagination1 - limitNumberStart - limitNumberStart;
            let limit = pagination1 - limitNumberStart;

            if (start === 0) {
                start = 1;
            }

            let info = [];
            let gen = [];


            for (start; start <= limit; start++) {
                let response = await Instance.get(`pokemon/${start}`)
                let response2 = await Instance.get(`item/${start}`)

                gen.push(response2.data);
                info.push(response.data);
            }

            setPagination1(limit);
            setLoading(false);
            setGeneration1(gen);
            setList(info);

        } catch (e) {
            setError(
                {
                    active: true,
                    errors: ['Fallo la peticion al servidor, intente de nuevo']
                });
            setLoading(false);
        }
    }

    useEffect(() => {

        const getData = async () => {

            try {
                setList([])
                setError({ active: false, errors: [] });
                setLoading(true);

                let info = [];
                let gen = [];

                for (let i = 1; i <= 30; i++) {
                    let response = await Instance.get(`pokemon/${i}`)
                    let response2 = await Instance.get(`pokemon-species/${i}`)

                    gen.push(response2.data)
                    info.push(response.data)
                }

                setLoading(false);
                setPagination1(30);
                setGeneration1(gen);
                setList(info);

            } catch (e) {
                setError(
                    {
                        active: true,
                        errors: ['Fallo la peticion al servidor, intente de nuevo']
                    });
                setLoading(false);
            }

        }
        getData();

    }, [])

    return (
        <>
            <div className='d-flex justify-content-center flex-column'>
                <div className='mb-2'>
                    <SearchInput loading={loading} setSearched={setSearched} searched={searched} />

                    <Button variant='success' disabled={loading} onClick={(e) => Buscar(e)}>Buscar</Button>
                </div>
                <div>
                    <Button variant='info' disabled={loading || pagination1 === 30} onClick={() => paginationPrev()} className='w-25 p-2 me-2'>Atras</Button>

                    <Button variant='info' disabled={loading || pagination1 === 807} onClick={() => paginationNext()} className='w-25 p-2'>Siguiente</Button>
                </div>
            </div>


            <Container className='mt-5 shadow'>
                <Table responsive bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Nombre</th>
                            <th>Generación</th>
                            <th>Experiencia</th>
                            <th>Peso</th>
                            <th>Inspecionar Pokemon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading &&
                            <tr>
                                <td colSpan={6}>
                                    <Spinner animation="grow" variant="primary" />
                                    <Spinner animation="grow" variant="secondary" />
                                    <Spinner animation="grow" variant="success" />
                                    <Spinner animation="grow" variant="danger" />
                                    <Spinner animation="grow" variant="warning" />
                                    <Spinner animation="grow" variant="info" />
                                    <Spinner animation="grow" variant="light" />
                                    <Spinner animation="grow" variant="dark" />
                                </td>
                            </tr>
                        }

                        {error.active
                            &&
                            <tr>
                                <td colSpan={6} className='text-center'>
                                    {error.errors.map(item => (
                                        <p>{item}</p>
                                    ))}
                                </td>
                            </tr>
                        }

                        {list.map((poke, index) => (
                            <tr key={index}>
                                <td>{poke.id}</td>
                                <td>{poke.name}</td>
                                <td>{generation1[index].generation.name}</td>
                                <td>{poke.base_experience}</td>
                                <td>{poke.weight}</td>
                                <td className='p-3'>
                                    <Link to={`/perfil/${poke.id}`} className='btn btn-outline-light w-75 p-2'>Inspecionar</Link>
                                </td>
                            </tr>

                        ))}

                    </tbody>
                </Table>
            </Container>

        </>
    );
}

export { index };