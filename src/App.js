/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from 'react';
import './App.css';
import tmdb from './tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const LoadAll = async () => {
      // Lista
      let list = await tmdb.getHomeList();
      setMovieList(list);

      // Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomFeatured = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomFeatured];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');
      setFeatureData(chosenInfo);
    }
    LoadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return(
    <div className='page'>

      <Header black={blackHeader}/>

      {featureData &&
        <FeaturedMovie item={featureData} />
      }

      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label='heart'>❤️</span> por <a className='link' href='https://github.com/pablorodrigo01'>Pablo Rodrigo</a><br/>
        Direitos de imagem para Netflix<br/>
        Dados utilizados do site <a href='https://www.themoviedb.org'><img className='logo' src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg'/></a>
      </footer>

      {movieList.length <= 0 &&
        <div className='loading'>
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
        </div>
      }

    </div>
  );
}