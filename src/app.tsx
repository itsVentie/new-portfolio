import { useState } from 'preact/hooks';
import { Header } from './components/Header/Header';
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { Projects } from './pages/Projects/Projects';
import { Contact } from './pages/Contact/Contact';

type Page = 'home' | 'about' | 'projects' | 'contact';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </>
  );
}