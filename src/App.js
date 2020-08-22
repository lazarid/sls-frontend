import React, {useEffect} from "react";
import NavBar from "./components/NavBar";
import { Prompt, Redirect } from 'react-router-dom';
import {ConfigProvider } from 'antd';
import heIL from 'antd/es/locale/he_IL'
import 'antd/dist/antd.css';;
import { Router, Switch , Route } from "react-router-dom";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import AuctionsPage from './pages/AuctionsPage';
import HomePage from './pages/HomePage';
import CreateAuctionPage from './pages/CreateAuctionPage';
import LoadingSpinner from './components/LoadingSpinner';
import { inject, observer } from 'mobx-react';
import queryString from 'query-string';

const App = (props) => {
  const { overlayStore , authStore , routerHistory} = props;
console.log(authStore.token)
  useEffect(() => {
    async function fn(){
      let params = queryString.parse(window.location.search)
      await authStore.socialSignIn(params.code)
      routerHistory.push(`/auctions`)
    }
    if (window.location.search.includes("code=") && !authStore.token){
      console.log(window.location.search)
      fn()
    }
  }, [authStore.token]);

  return (
    <ConfigProvider locale={heIL} direction="rtl">
    <div className="App">
      <LoadingSpinner display={overlayStore.displaySpinner} />
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <PrivateRoute path="/auctions" component={AuctionsPage} />
          <PrivateRoute path="/create" component={CreateAuctionPage} />
        </Switch>
      </Router>
    </div>
    </ConfigProvider>
  );
}

export default inject('authStore','overlayStore','routerHistory')(observer(App));
