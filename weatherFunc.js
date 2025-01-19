
export const weather = (city='') => {
    if(city.toLowerCase() === 'delhi'){
        return '100 degrees';
    }
    if(city.toLowerCase() === 'tokyo'){
        return '20 degrees';
    }
    if(city.toLowerCase() === 'new york'){
        return '50 degrees';
    }
    if(city.toLowerCase() === 'patna'){
        return '10 degrees';
    }
}