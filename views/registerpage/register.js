const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');


signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});


signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});
const config = {
    curl: "https://api.countrystatecity.in/v1/countries",
    ckey: "QnVlV3lTcWRoOGJoSTN6VzNRcVFhcWpaRkVpUmYzNUk3Q1djN0xrRw==",
};


//get countries
const getcountries = async (fieldname, ...args) =>{
    let apiendpoint;
    //https://api.countrystatecity.in/v1/countries/[ciso]/states
    switch(fieldname){
        case 'countries':
            apiendpoint = config.curl;
            break;
        case 'states':
            apiendpoint = `${config.curl}/${args[0]}/states`;
            break;
        case 'cities':
            apiendpoint = `${config.curl}/${args[0]}/states/${args[1]}/cities`;
            default :
    }

    const response = await fetch(apiendpoint,{
        headers:{ "X-CSCAPI-KEY" : config.ckey },
    });
    if(response.status !=200) {
        throw new Error (`Something went wrong,status code: ${response.status}`);
    }
    const countries = await response.json();
    return countries ;
} ;

const countriesListDropDown = document.querySelector("#countrylist");
const statesListDropDown = document.querySelector("#statelist");
const citiesListDropDown = document.querySelector("#citylist");

document.addEventListener('DOMContentLoaded', async ()=> {
    const countries = await getcountries('countries');
    let countriesoptions="";
    if(countries){
        countriesoptions += `<option value ="">-- Select Country --</option>`;
        countries.forEach(coutry => {
            countriesoptions += `<option value ="${coutry.iso2}">${coutry.name}</option>`;
        });
        countriesListDropDown.innerHTML=countriesoptions;
    }
    //List States 
     countriesListDropDown.addEventListener("change", async function () {
        const selectedcountrycode = this.value;
        let states = await getcountries('states',selectedcountrycode);
        states = states.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
          });
    //==============================================================
    console.log(states);
    //==============================================================
        let statesoptions="";
    if(states){
        statesoptions += `<option value ="">-- Select State --</option>`;
        states.forEach(state => {
            statesoptions += `<option value ="${state.iso2}">${state.name}</option>`;
        });
        statesListDropDown.innerHTML = statesoptions;
        statesListDropDown.disabled = false;
      }
    });
    statesListDropDown.addEventListener("change", async function () {
        const selectedcountrycode = countriesListDropDown.value;
        const selectedstatecode = this.value;
        let cities = await getcountries('cities',selectedcountrycode,selectedstatecode);
        cities = cities.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
          });
        let citiesoptions="";
    if(cities){
        citiesoptions += `<option value ="">-- Select City --</option>`;
        cities.forEach(city => {
            citiesoptions += `<option value ="${city.name}">${city.name}</option>`;
        });
        citiesListDropDown.innerHTML = citiesoptions;
        citiesListDropDown.disabled = false;
      }
    });
});
let navbar = document.querySelector('.header .navbar');
// let searchForm = document.querySelector('.header .search-form');
let loginForm = document.querySelector('.header .login-form');
// let contactInfo = document.querySelector('.contact-info');

document.querySelector('#menu-btn').onclick = () =>{
   navbar.classList.toggle('active');
   searchForm.classList.remove('active');
   loginForm.classList.remove('active');
};

document.querySelector('#login-btn').onclick = () =>{
   loginForm.classList.toggle('active');
   navbar.classList.remove('active');
   searchForm.classList.remove('active'); 
};

window.onscroll = () =>{
   navbar.classList.remove('active');
   // searchForm.classList.remove('active');
   // loginForm.classList.remove('active');
   // contactInfo.classList.remove('active');
}