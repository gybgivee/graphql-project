import { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client'

export const CategoriesContext = createContext({
  categoriesMap: {},
});
const COLLECTIONS = gql`
query{
  collections{
    id
    title
    items{
      id
      name
      price
      imageUrl
    }
  }
}`
export const CategoriesProvider = ({ children }) => {
  const [categoriesMap, setCategoriesMap] = useState({});

  const {loading,error,data} = useQuery(COLLECTIONS);
 
  useEffect(()=>{
    if(data){
      const {collections}=data;
      const collectionsMap = collections.reduce((acc,collection)=>{
        const {title,items} = collection;
        acc[title.toLowerCase()] = items;
        return acc;
      },{})
      setCategoriesMap(collectionsMap);
    }
  },[data])

  /* before we get the data direct from firebase
    useEffect(() => {
      const getCategoriesMap = async () => {
        const categoryMap = await getCategoriesAndDocuments();
        setCategoriesMap(categoryMap);
      };
  
      getCategoriesMap();
    }, []);*/

  const value = { categoriesMap,loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
