import { RequestService } from '../../Component/RequestService';

/**
 *
 * @param {RequestService} requestService The request
 * @param {object} configServer The server config
 */
export function AuthenticationService(requestService, configServer) {
  this.observers = [];
  this.loginUrl = `${configServer.url}${configServer.login}`;
  // Route to manage users (register)
  this.userUrl = `${configServer.url}${configServer.user}`;
  // Route to get personal information
  this.userMeUrl = `${configServer.url}${configServer.userMe}`;

  this.loginRequiredKeys = ['username', 'password'];
  this.registerRequiredKeys = [
    'username',
    'firstName',
    'lastName',
    'password',
    'email',
  ];
  this.storageKeys = {
    token: 'user.token',
    firstname: 'user.firstname',
    lastname: 'user.lastname',
    username: 'user.username',
    email: 'user.email',
  };

  this.requestService = requestService;

  this.initialize = function initialize() {
    this.requestService.setAuthenticationService(this);
  };

  this.login = async function login(formData) {
    if (!this.formCheck(formData, this.loginRequiredKeys)) {
      throw 'Invalid form';
    }

    if (this.isUserLoggedIn()) {
      throw 'Already logged in';
    }

    const result = (
      await this.requestService.send('POST', this.loginUrl, formData, false)
    ).response;
    const resultJson = JSON.parse(result);
    if (!resultJson) {
      throw 'Username or password is incorrect';
    }
    const jwt = resultJson.token;
    if (jwt !== undefined && jwt !== null) {
      this.storeToken(jwt);
      const response = JSON.parse(
        (await this.requestService.send('GET', this.userMeUrl)).response
      );
      const user = {
        firstname: response.firstName,
        lastname: response.lastName,
        username: response.username,
        email: response.email,
      };

      this.storeUser(user);

      this.notifyObservers();
    } else {
      throw 'Username or password is incorrect';
    }
  };

  this.logout = function logout() {
    if (!this.isUserLoggedIn()) {
      throw 'Not logged in';
    }
    this.removeUserFromSession();

    this.notifyObservers();
  };

  this.register = async function register(formData) {
    if (!this.formCheck(formData, this.registerRequiredKeys)) {
      throw 'Invalid form';
    }
    if (this.isUserLoggedIn()) {
      throw 'Already logged in';
    }
    const result = (
      await this.requestService.send('POST', this.userUrl, formData, false)
    ).response;
    JSON.parse(result);

    this.notifyObservers();
  };

  this.formCheck = function formCheck(formData, requiredKeys) {
    for (const key of requiredKeys) {
      if (formData.get(key) === null) {
        console.error(`Missing key in form : ${key}`);
        return false;
      }
    }
    return true;
  };

  this.removeUserFromSession = function removeUserFromSession() {
    window.sessionStorage.removeItem(this.storageKeys.token);
    window.sessionStorage.removeItem(this.storageKeys.firstname);
    window.sessionStorage.removeItem(this.storageKeys.lastname);
    window.sessionStorage.removeItem(this.storageKeys.username);
    window.sessionStorage.removeItem(this.storageKeys.email);
  };

  this.storeToken = function (token) {
    window.sessionStorage.setItem(this.storageKeys.token, token);
  };

  this.storeUser = function storeUser(user) {
    window.sessionStorage.setItem(this.storageKeys.firstname, user.firstname);
    window.sessionStorage.setItem(this.storageKeys.lastname, user.lastname);
    window.sessionStorage.setItem(this.storageKeys.username, user.username);
    window.sessionStorage.setItem(this.storageKeys.email, user.email);
  };

  this.getUser = function getUser() {
    const user = {};
    user.token = window.sessionStorage.getItem(this.storageKeys.token);
    if (user.token === null || user.token === undefined) {
      return null;
    }
    user.firstname = window.sessionStorage.getItem(this.storageKeys.firstname);
    user.lastname = window.sessionStorage.getItem(this.storageKeys.lastname);
    user.username = window.sessionStorage.getItem(this.storageKeys.username);
    user.email = window.sessionStorage.getItem(this.storageKeys.email);
    return user;
  };

  this.isUserLoggedIn = function isUserLoggedIn() {
    try {
      const user = this.getUser();
      return user !== null && user !== undefined;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Observers
  this.addObserver = function (observerFunction) {
    this.observers.push(observerFunction);
  };

  this.notifyObservers = function () {
    for (const observer of this.observers) {
      observer();
    }
  };

  this.initialize();
}
