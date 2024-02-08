const fs =require('fs')
async function readCities(){
    return new Promise((resolve,reject)=>{
        fs.readFile('teext.txt', 'utf8', (err, data) => {
            if (err) {
              reject ('Error reading file:', err)
            } else {
              let arr = data.split(',');
              let cities = [];
              for(let i = 0; i < arr.length; i += 3){
                  let city = {
                      name: arr[i].trim(),
                      lat: parseFloat(arr[i+1]),
                      lng: parseFloat(arr[i+2])
                  };
                  cities.push(city);
              }
              resolve(cities);
            }
          });
        
    })
      
}



async function deleteFile(randomcity){
  return new Promise((resolve, reject) => {
      fs.unlink(`${randomcity.name}.txt`, (err) => {
          if (err) {
            reject('cant delete file')
          } else {
            resolve('File deleted successfully.');
          }
        });
  })

}


async function createNewfile(temperature , randomcity){
  fs.writeFile(`${randomcity.name}.txt`, `temperaature is : ${temperature}`, (err) => {
      if (err) {
        console.error('Error creating file:', err);
      } else {
        //console.log('File created successfully.');
      }
    });

}


async function fetchTemperature(city){

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`);
  const data = await response.json();
  return data.current_weather.temperature;
}


function selectRandomCities (cities){
  const randomIndex = Math.floor(Math.random()* cities.length)
  const city = cities[randomIndex]
  return city
}


  async function main(){
      const cities = await readCities()
      console.log(cities)
      const randomcity = await selectRandomCities(cities) 
      console.log('random city is: ')
      console.log( randomcity.name )
      const temperature = await fetchTemperature(randomcity)
      console.log(`Temprature of the city ${randomcity.name} is : ` + temperature)
      const fileExit = fs.existsSync(`${randomcity}.txt`)
      if(fileExit){ deleteFile(randomcity)}
     
       await createNewfile(temperature , randomcity)
      
      
  }
      
main();