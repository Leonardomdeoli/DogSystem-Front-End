/**
 * @author Leonardo Mendes 24-02-2018
 */

var app = angular.module('dog-system');

//var BASE_URL = 'http://localhost:8080/api';

var BASE_URL = 'https://dogsystem.herokuapp.com/api';

app.constant('ServicePathConstants', {
    ROOT_PATH: BASE_URL,
    PUBLIC_PATH: BASE_URL + '/public',
    PRIVATE_PATH: BASE_URL + '/private'
});

app.constant('DateUtisConstants', {
    DEFAULT_DATETIME_FORMAT: 'DD/MM/YYYY HH:mm:ss',
    DEFAULT_DATETIME_FORMAT_IGNORE_SECONDS: 'DD/MM/YYYY HH:mm',
    DEFAULT_DATE_FORMAT: 'DD/MM/YYYY',
    DEFAULT_TIME_FORMAT: 'HH:mm:ss',
});