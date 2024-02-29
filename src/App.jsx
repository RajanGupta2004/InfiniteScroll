import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import { useRef } from "react";
import { useCallback } from "react";

function App() {
  const loaderref = useRef();
  const [images, setImages] = useState([]);
  const [pages, setPages] = useState(2);
  const [loading, setloading] = useState(false);

  const fetchImages = async (index) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/photos?_page=${index}&_limit=9`;
      const result = await fetch(url);
      const data = await result.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getData = useCallback(async () => {
    if (loading) {
      return;
    }

    setloading(true);

    const data = await fetchImages(pages);
    setImages((prev) => [...prev, ...data]);
    setTimeout(() => setloading(false), 3000);

    setPages((pages) => pages + 1);
  }, [pages, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        getData();
      }
    });

    if (loaderref.current) {
      observer.observe(loaderref.current);
    }

    return () => {
      if (loaderref.current) {
        observer.unobserve(loaderref.current);
      }
    };
  }, [getData]);

  const fetchfirstPage = async () => {
    const data = await fetchImages(1);
    setImages(data);
  };

  useEffect(() => {
    fetchfirstPage();
  }, []);
  // console.log(images);
  return (
    <>
      <div className="app">
        <h1>Infinite Scroll</h1>
        <div className="wrapper">
          {images?.map((item, i) => (
            <img src={item.thumbnailUrl} key={i} alt="img" />
          ))}
        </div>
        <div ref={loaderref}>{loading && <h1>Loading data</h1>}</div>
      </div>
    </>
  );
}

export default App;
