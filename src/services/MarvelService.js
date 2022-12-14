import { useHttp } from "../hooks/http.hook";

const  useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=cb9cb89d593c147dac376bc1a92764e3';
    const _baseOffset = 210;



    const getAllCharacters = async(offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        console.log(res);
        return _transformComic(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }

    const _transformComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            issueNum: comic.issueNumber,
            price: comic.prices[0] && comic.prices[0].price ?  `${comic.prices[0].price}$` : 'not-available',
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            url: comic.urls[0].url,
            description: comic.description,
            pages: comic.pageCount ? `${comic.pageCount} p.` : 'No information about the number of pages',
            language: comic.textObjects[0] && comic.textObjects[0].language || 'en-us',
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic}
        
}

export default useMarvelService;