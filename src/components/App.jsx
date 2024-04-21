import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './SearchBar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { fetchImages } from '../api/imagesApi/imagesGet';

const defState = {
  query: '',
  page: 1,
  images: [],
  loading: false,
  showModal: false,
  largeImageURL: '',
  loadMore: false,
  totalHits: 0,
};

export const App = () => {
  const [comp, setComp] = useState(defState);

  const loadImages = useCallback(async () => {
    setComp(prev => ({ ...prev, loading: true }));
    try {
      const { hits, totalHits } = await fetchImages(comp.query, comp.page);
      if (hits.length === 0) {
        toast.info(
          `No images found with name ${comp.query}. Try another search.`
        );
        setComp(prev => ({
          ...prev,
          loading: false,
          loadMore: false,
        }));
        return;
      }

      setComp(prev => ({
        ...prev,
        images: [...prev.images, ...hits],
        totalHits,
        loading: false,
      }));
    } catch (error) {
      setComp(prev => ({ ...prev, loading: false }));
      toast.error('There was a problem with the request.');
    }
  }, [comp.query, comp.page]);

  useEffect(() => {
    if (comp.page !== 1 || comp.query) {
      loadImages();
    }
  }, [comp.page, comp.query, loadImages]);

  useEffect(() => {
    if (
      comp.images.length === comp.totalHits &&
      comp.totalHits > 0 &&
      !comp.loading
    ) {
      toast.info('No more images to load.');
    }
  }, [comp.loading, comp.images.length, comp.totalHits]); // Updated dependencies

  const handleSearchSubmit = query => {
    setComp({ ...defState, query });
  };

  const handleLoadMore = () => {
    setComp(prev => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  const handleImageClick = largeImageURL => {
    setComp(prev => ({ ...prev, largeImageURL, showModal: true }));
  };

  const closeModal = () => {
    setComp(prev => ({ ...prev, showModal: false }));
  };

  const { images, loading, showModal, largeImageURL, totalHits } = comp;
  const loadMore = images.length > 0 && images.length < totalHits;

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} currentQuery={comp.query} />
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
