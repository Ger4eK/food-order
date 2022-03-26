import { React, useState, useEffect } from 'react';
import Card from '../../UI/Card/Card';
import MealItem from '../MealItem/MealItem';
import classes from './AvailableMeals.module.css';

//const DUMMY_MEALS = [
//  {
//    id: 'm1',
//    name: 'Sushi',
//    description: 'Finest fish and veggies',
//    price: 22.99,
//  },
//  {
//    id: 'm2',
//    name: 'Schnitzel',
//    description: 'A german specialty!',
//    price: 16.5,
//  },
//  {
//    id: 'm3',
//    name: 'Barbecue Burger',
//    description: 'American, raw, meaty',
//    price: 12.99,
//  },
//  {
//    id: 'm4',
//    name: 'Green Bowl',
//    description: 'Healthy...and green...',
//    price: 18.99,
//  },
//];

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    const fetchMealsData = async () => {
      setIsLoading(true);
      const response = await fetch(
        'https://react-http-9066a-default-rtdb.firebaseio.com/meals.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMeals = [];
      for (const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    //! it's a promise and add to catch method on it - fetchMealsData().catch(...)
    fetchMealsData().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  const mealsList = meals.map((meal) => (
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        {isLoading && <p className={classes.isLoading}>Loading...</p>}
        {httpError && <p className={classes.isError}>{httpError}</p>}
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
