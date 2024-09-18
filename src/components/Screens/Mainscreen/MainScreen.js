
import { Link } from 'react-router-dom';
import './MainScreen.css';
import Header from './Header';
import Post from './PostDemo';
import IndexPage from './IndexPage';



function MainScreen() {
  return (
    <div className='MainScreen'>
       <main>
      <Header></Header>
      <IndexPage></IndexPage>

    </main>

    </div>
   
  );
}

export default MainScreen;
