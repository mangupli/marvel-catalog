import { Component } from 'react';
import { Fragment } from 'react';

import PropTypes from 'prop-types';

import './charInfo.scss';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'


class CharInfo extends Component {

    state = {
        character: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    onCharLoaded = (character) => {
        /* console.log(character); */
        this.setState({
            character, 
            loading: false
        });
    }

    onCharLoading = ()=> {
        this.setState({
            loading:true,
            error: false});
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    componentDidMount() {
        this.updateCharacter();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId){
            this.updateCharacter();
        }
    }
        

    updateCharacter = () => {
        
        const {charId} = this.props;
        if(!charId){
            return;
        }

        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        const{character, loading, error} = this.state;
        const skeleton = character || loading || error ? null : <Skeleton/>

        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error || !character) ? <View character={character}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({character}) => {
        const {name, description, thumbnail, homepage, wiki, comics} = character;
        let styleObj = {objectFit : 'cover'};
            if(thumbnail.includes('image_not_available')){
                styleObj = {objectFit : 'unset'};
            }
        return(
            <Fragment>
                <div className="char__basics">
                    <img style={styleObj} src={thumbnail} alt={name}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'Not found'}
                    {
                        comics.map((item, i) => {
                            // eslint-disable-next-line
                            if (i > 9) return;
                            return(
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            );
                        })
                    }                   
                </ul>
            </Fragment>
        )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;