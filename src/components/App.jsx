import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './SearchBar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { fetchImages } from '../api/imagesApi/imagesGet';

export const App = () => {
  const [loadMore, setLoadMore] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    const loadImages = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const { hits, totalHits: newTotalHits } = await fetchImages(
          query,
          page
        );
        if (hits.length === 0) {
          toast.info(`No images found with name ${query}. Try another search.`);
          setLoadMore(false);
        } else {
          setImages(prev => [...prev, ...hits]);
          const isMore = page < Math.ceil(newTotalHits / 12);
          if (!isMore) {
            toast.info('No more images to load.');
          }
          setLoadMore(isMore);
        }
      } catch (error) {
        toast.error('There was a problem with the request.');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [query, page]);

  const handleSearchSubmit = newQuery => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1);
      setImages([]);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleImageClick = url => {
    setLargeImageURL(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} currentQuery={query} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {loadMore && <Button onClick={handleLoadMore}>Load more</Button>}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
      <ToastContainer />
    </div>
  );
};
