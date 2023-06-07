import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Home } from '../components/pages/Home';
import { Footer } from '../components/layout/Footer';
import { SideBar } from '../components/layout/SideBar';
import { Articles } from '../components/pages/Articles';
import { Create } from '../components/pages/Create';
import { Search } from '../components/pages/Search';
import { Article } from '../components/pages/Article';
import { Edit } from '../components/pages/Edit';

export const BlogRoutes = () => {
    return (
        <BrowserRouter>
            {/* Layout */}
            <Header />
            <Navigation />
            {/* Content and routes */}
            <section id='content' className='content'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/articles' element={<Articles />} />
                    <Route path='/create' element={<Create />} />
                    <Route path='/search/:search' element={<Search />} />
                    <Route path='/article/:id' element={<Article />} />
                    <Route path='/edit/:id' element={<Edit />} />
                    <Route
                        path='*'
                        element={
                            <div className='jumbo'>
                                <h1>Error 404</h1>
                                <p>Page not found!.</p>
                            </div>
                        }
                    />
                </Routes>
            </section>
            <SideBar />
            <Footer />
        </BrowserRouter>
    );
};
