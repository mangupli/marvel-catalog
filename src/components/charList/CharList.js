import { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const CharList = (props) => {

    const [characters, setCharacters] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charactersFinished, setCharactersFinished] = useState(false);
    
    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(()=>{
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initialValue)=>{
        initialValue ? setNewItemLoading(false) : setNewItemLoading(true); 
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }


    const onCharListLoaded = (newCharacters) => {

        let finished = false;
        if(newCharacters.length < 9){
            finished = true;
        }

        setCharacters(characters => [...characters, ...newCharacters]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharactersFinished(finished);

    }

    let charactersRefs = useRef([]);  

    const onClick = (id, index) => {
        props.onCharSelected(id);
        focusOnChar(index);
    }

    const focusOnChar = (id) => {
        charactersRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        charactersRefs.current[id].classList.add('char__item_selected');
        charactersRefs.current[id].focus();
    }

    const renderListItems = (characters) => {
        const elems = characters.map((character, index) => {
            const {id, name, thumbnail} = character;

            let styleObj = {objectFit : 'cover'};
            if(thumbnail && thumbnail.includes('image_not_available')){
                styleObj = {objectFit : 'unset'};
            }

            return(
                <li
                    tabIndex="0"
                    key={id}
                    className="char__item"
                    onClick={()=>onClick(id, index)}
                    ref={elem => charactersRefs.current[index] = elem}
                >
                    <img style={styleObj} src={thumbnail} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>

            );
        });
        return elems;
    }


    const items = renderListItems(characters);
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
/*     const listItems = !(loading || error) ? items : null; */

    return (
        <div className="char__list">
            <ul className="char__grid">
                {items}            
            </ul>
            {spinner}
            {errorMessage}    
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={()=> onRequest(offset)}
                style={charactersFinished ? {display: 'none'} : {display: 'block'}}
                >
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;