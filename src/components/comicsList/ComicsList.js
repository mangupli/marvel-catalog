import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [itemsFinished, setItemsFinished] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect (()=>{
        loadComics(offset, true);
    },[]);

    const onComicsLoaded = (newComics) => {
        setComics(comics => [...comics, ...newComics]);
        setOffset(offset => offset + 8);
        setNewItemLoading(false);
       if (newComics.length < 8){
            setItemsFinished(true);
       }
    }


    const loadComics = (offset, initialValue) => {
        initialValue ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
        .then(onComicsLoaded)
    }

    const renderComics = (comics) => {
        
        const elems = comics.map((item, index) => {
            const{id, title, issueNum, price, thumbnail, url} = item;
            return (
                <li className="comics__item" key={index}>
                <Link to={`/comics/${id}`}>
                    <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                    <div className="comics__item-name">{title}</div>
                    <div className="comics__item-price">{price}</div>
                </Link>
            </li>
            )
        });
        return (
        <ul className="comics__grid">
            {elems}
        </ul>
        )
    }

    const items = renderComics(comics);
    const spinner = (loading && !newItemLoading) ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    const styleObj = {display: 'block'};
    if (itemsFinished){
        styleObj = {display: 'none'};
    }


    return (
        <div className="comics__list">           
            {items}
            {spinner}
            {errorMessage}
            <button
                className="button button__main button__long"
                onClick={()=>loadComics(offset)}
                disabled={newItemLoading ? true : false}
                style={styleObj}
                >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;