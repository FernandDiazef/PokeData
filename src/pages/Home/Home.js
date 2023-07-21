import React, { useEffect, useState } from 'react';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Instance } from '../../API/api';
import { SearchInput } from '../../components/searchInput/searchInput';

const Home = () => {

    const [list, setList] = useState([]);
    const [generation1, setGeneration1] = useState([]);
    const [searched, setSearched] = useState('');
    const [copia, setCopia] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({ active: false, errors: [] });
    const [pagination1, setPagination1] = useState({ start: 1, limit: 20 });
    const [mostrar, setMostrar] = useState(false)
    const [copiaGeneration, setCopiaGeneration] = useState([]);

    const change = (text) => {
        if (text === '') {
            setMostrar(true);
        } else {
            setMostrar(false)
        }
        if (list.length > 1) {
            setMostrar(false);
        }
        if (text.trim() || searched !== '') {
            setSearched(text);
        }
    }

    const Buscar = async (text) => {

        let copia1 = [...list];
        let copia2 = [...generation1];


        try {
            if (searched === '') {
                if (copia1.length > 1) {
                    setList(copia1)
                    setGeneration1(copia2);
                } else {
                    setList(copia)
                    setGeneration1(copiaGeneration)
                    setCopia([])
                }
                setSearched('');
                setMostrar(false);
            } else {
                const response = await Instance.get(`pokemon/${searched.toLowerCase()}/`);
                let response2 = await Instance.get(`pokemon-species/${searched.toLowerCase()}`)
                if (list.length > 1) {
                    setCopia(list);
                    setCopiaGeneration(generation1);
                }
                setMostrar(true);
                setList([response.data]);
                setGeneration1([response2.data]);
                setSearched('');
            }

        } catch (e) {
            alert('El pokemon no exite');
            if (copia1.length > 1) {
                setList(copia1)
                setGeneration1(copia2);
            } else {
                setList(copia)
                setGeneration1(copiaGeneration)
                setCopia([])
            }
            setSearched('');
            setMostrar(false);
        }
    }

    const paginationNext = () => {
        let nextPagination = pagination1;
        nextPagination.limit = nextPagination.limit + 20;
        setPagination1(nextPagination)
        getData()
    }

    const paginationPrev = () => {
        let nextPagination = pagination1;
        nextPagination.start -= 40;
        nextPagination.limit -= 20;
        setPagination1(nextPagination)
        getData()
    }

    const getData = async () => {

        try {
            setError({ active: false, errors: [] });
            setList([])
            setLoading(true);

            let info = [];
            let gen = [];
            let vueltas = pagination1;

            for (vueltas.start; vueltas.start <= vueltas.limit; vueltas.start++) {
                let response = await Instance.get(`pokemon/${vueltas.start}`)
                let response2 = await Instance.get(`pokemon-species/${vueltas.start}`)

                gen.push(response2.data)
                info.push(response.data)
            }
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
        getData();
    }, [])

    return (
        <>
            <div className='d-flex justify-content-center flex-column'>
                <div className='mb-2'>
                    <SearchInput loading={loading} setSearched={change} searched={searched} />

                    <Button variant='success' disabled={loading} onClick={(e) => Buscar(e)}>
                        {mostrar
                            ?
                            <i className="bi bi-arrow-clockwise"></i>
                            :
                            <i className="bi bi-search"></i>
                        }
                    </Button>
                </div>
                <div>
                    <Button variant='info' disabled={loading || pagination1.limit === 20} onClick={() => paginationPrev()} className='w-25 p-2 me-2'>Atras</Button>

                    <Button variant='info' disabled={loading || pagination1.limit === 807} onClick={() => paginationNext()} className='w-25 p-2'>Siguiente</Button>
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

export { Home };