import { Component } from 'react';

import PropTypes from 'prop-types';

import './charList.scss';
/* import abyss from '../../resources/img/abyss.jpg'; */
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {
    
    state = {
        characters: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charactersFinished: false
    }

    marvelService = new MarvelService();

    onCharListLoaded = (newCharacters) => {

        let finished = false;
        if(newCharacters.length < 9){
            finished = true;
        }

        this.setState(({offset, characters}) => ({
            characters : [...characters, ...newCharacters],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charactersFinished: finished
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    onCharListLoading = () =>{
        this.setState({
            newItemsLoading: true
        });
    }
    
    loadCharacters = () => {
        this.onRequest();
    }


    componentDidMount(){
        console.log('mount');
        this.loadCharacters();
    }


    onRequest = (offset)=>{
        console.log('load');
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onClick = (id, index) => {
        this.props.onCharSelected(id);
        this.focusOnChar(index);
    }


    charactersRefs = [];  
    selectedRefIndex = null;

    
    addCharRef = (item) => {
        this.charactersRefs.push(item);
    }

    focusOnChar = (index) => {

        if(this.selectedRefIndex !== null &&  this.charactersRefs[this.selectedRefIndex]){
            this.charactersRefs[this.selectedRefIndex].classList.remove('char__item_selected');
        }
        this.selectedRefIndex = index;
        this.charactersRefs[index].classList.add('char__item_selected');
        this.charactersRefs[index].focus();
    }

    renderListItems = (characters) => {
        const elems = characters.map((character, index) => {

            const {id, name, thumbnail} = character;

            let styleObj = {objectFit : 'cover'};
            if(thumbnail.includes('image_not_available')){
                styleObj = {objectFit : 'unset'};
            }

            return(
                <li
                    tabIndex="0"
                    key={id}
                    className="char__item"
                    onClick={()=>this.onClick(id, index)}
                    ref={this.addCharRef}
                >
                    <img style={styleObj} src={thumbnail} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>

            );
        });
        return elems;
    }

    render() {

        console.log('render');

        const {characters, loading, error, newItemsLoading, offset, charactersFinished} = this.state;


        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const listItems = !(loading || error) ? this.renderListItems(characters) : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {listItems}            
                </ul>
                {spinner}
                {errorMessage}    
                <button
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    onClick={()=> this.onRequest(offset)}
                    style={charactersFinished ? {display: 'none'} : {display: 'block'}}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

/* 
const ListItem = (props) => {
    const {name, thumbnail} = props;
    let styleObj = {objectFit : 'cover'};
    if(thumbnail.includes('image_not_available')){
        styleObj = {objectFit : 'unset'};
    }
    return (
        <li className="char__item">
            <img style={styleObj} src={thumbnail} alt={name}/>
            <div className="char__name">{name}</div>
        </li>
    );
}
 */

export default CharList;