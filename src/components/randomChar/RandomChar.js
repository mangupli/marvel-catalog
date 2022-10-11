import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage'

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png'; 

class RandomChar extends Component {

    state = {
        character: {},
        loading: true,
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
        

    updateCharacter = () => {
        this.onCharLoading();
        const id = Math.floor(Math.random() * (1011400 - 1011000)) + 1011000;
        this.marvelService.getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
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


    render(){
        const {character, loading, error} = this.state;    
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View character={character}/> : null;
        
/*         console.log('render'); */

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateCharacter} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({character}) => {
    const {name, description, thumbnail, homepage, wiki} = character;
    let styleObj = {'objectFit' : 'cover'}; 
    if(thumbnail.includes('image_not_available')){
        styleObj = {objectFit : 'unset'};
    }

    return(
        <div className="randomchar__block">
            <img src={thumbnail} style={styleObj} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
}   

export default RandomChar;