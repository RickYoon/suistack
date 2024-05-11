import React from 'react';
import ReactDOM from 'react-dom';  // react v17 버전용
import App from './App';
import reportWebVitals from './reportWebVitals';
// import ReactGA from 'react-ga';

// console.log();
// if(window.location.hostname !== "localhost"){
    // ReactGA.initialize('G-WTWX3TJM39');
    // ReactGA.pageview(window.location.pathname + window.location.search);
// }

// react v 17 버전용
ReactDOM.render(
    <React.StrictMode>
          <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
  
