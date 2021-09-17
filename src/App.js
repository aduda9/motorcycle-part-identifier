import './App.scss';
import './components/pages/add_parts/add_parts.js'

import AddPartsPage from './components/pages/add_parts/add_parts.js';
import MobileTabs from './components/navigation/mobile_tabs/mobile_tabs';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import InventoryPage from './components/pages/inventory/inventory';
// import inventory_manager from './inventory/inventory_manager';
import { useEffect } from 'react';
import HPFTopNav from './components/navigation/topnav/topnav';
import { HPFHiddenOnMobile, HPFShownOnDesktop, HPFShownOnMobile } from './components/general/page/hpf_page';
import HPFFooter from './components/navigation/footer/footer';

function App() {

  useEffect(()=>{
    // inventory_manager.init();
    // console.log("init")
  },[])

  return (
    <Router>
    <div className="app_container">

      <div className="app_desktop_navbar_container">
        <HPFTopNav/>
      </div>

      <div className="app_layout">

        <div className="app_page_container">
        
        <Switch>

            <Route exact path ="/">
              <AddPartsPage/>
              {/* <div className="page_test"/> */}
            </Route>

            <Route exact path ="/inventory">
              <InventoryPage/>
            </Route>

            {/* <Route exact path ="/details">
              <DetailsPage/>
            </Route> */}

        </Switch>
        </div>

        {/* <div className="app_dummy_element"/> */}

      </div>

      <div className="mobile_tabs_container">
        {/* <MobileTabs/> */}
        <HPFShownOnMobile>
          <MobileTabs/>
        </HPFShownOnMobile>
        <HPFShownOnDesktop>
          <HPFFooter/>
        </HPFShownOnDesktop>
      </div>
      

      
    </div>
    </Router>

  );
}

export default App;
