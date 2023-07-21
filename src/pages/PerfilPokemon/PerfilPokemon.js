import React, { useEffect, useState } from 'react';
import { Card, Container, Image, Placeholder } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Instance } from '../../API/api';

const PerfilPokemon = () => {

    const [pokemon, setPokemon] = useState();
    const [generation1, setGeneration1] = useState();
    const { pokeId } = useParams();

    useEffect(() => {
        const getData = async () => {
            const response = await Instance.get(`pokemon/${pokeId}`);
            const response2 = await Instance.get(`pokemon-species/${pokeId}`)

            setPokemon(response.data);
            setGeneration1(response2.data);

        }
        getData();

    }, [pokeId])

    return (
        <>
            <Container className='d-flex justify-content-center mt-5'>
                <Card style={{ width: '18rem' }} className='shadow'>
                    <Image src={pokemon && pokemon.sprites.other.home.front_default} />
                    <Card.Body>
                        <Card.Title>{pokemon && pokemon.name.toUpperCase()}</Card.Title>
                        {pokemon ?

                            <div className='text-start'>
                                <span className='d-flex flex-column text-start'>
                                    {pokemon.abilities.map((poke, index) => (
                                        <span key={index} className='mb-2'><span className='fw-bold'>Habilidad {index + 1}:</span> {poke.ability.name.toUpperCase()}.</span>
                                    ))}
                                </span>
                                <span><span className='fw-bold '>Peso:</span> {pokemon.weight}klg</span> <br />
                                <span><span className='fw-bold'>Experiencia:</span> {pokemon.base_experience}</span> <br />
                                
                                {/* <span><span className='fw-bold'>Generación:</span> {generation1 && generation1.game_indices[0].generation.name}</span> */}
                                
                                {/* <span><span className='fw-bold'>Generación:</span> {generation1 && generation1.generation.name}</span> */}
                               
                                <span><span className='fw-bold'>Generación:</span> {generation1 && generation1.generation.name}</span>

                                <div className='text-center'>
                                    <Link to='/' className='btn btn-outline-success mt-2 '>Regresar</Link>
                                </div>
                            </div>
                            :
                            <div>
                                <Placeholder as={Card.Title} animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                                <Placeholder as={Card.Text} animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder>
                                <Placeholder.Button variant="primary" xs={6} />
                            </div>

                        }
                    </Card.Body>
                </Card>

            </Container>
        </>
    );
}
export { PerfilPokemon };