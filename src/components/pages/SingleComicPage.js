import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


import './singleComicPage.scss';


const SingleComicPage = () => {

    const {comicId} = useParams();

    const [comic, setComic] = useState(null);

    const {error, loading, getComic, clearError} = useMarvelService();

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    useEffect(() => {
        updateComic()
    }, [comicId])


    const updateComic = () => {
        if (!comicId) {
            return;
        }

        clearError();

        getComic(comicId)
            .then(onComicLoaded)
    }

    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
 

}

const View = ({comic}) => {
    const{ title, price, thumbnail, url, description, language, pages} = comic;
    return (
        <div className="single-comic">
            <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pages}</p>
                <p className="single-comic__descr">{`Language: ${language}`}</p>
                <div className="single-comic__price">{`Price: ${price}`}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;