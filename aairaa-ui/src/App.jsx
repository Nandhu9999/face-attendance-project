import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import Login from './pages/login/Login'
import Admin from './pages/home/Admin';
import Student from './pages/home/Student'
import { Box } from '@mui/material';
import Members from './pages/members/Members';
import Guest from './pages/guest/Guest';

const theme = createTheme({
  palette: {
    primary: {
      main: "#BE1D60", // Change this to your desired primary color
    },
    secondary: {
      main: '#f50057', // Change this to your desired secondary color
    },
    text: {
      primary: '#ffffff',
    },
  }
});


function App() {
  return (
    <ThemeProvider theme={theme}>

    <Box className="App" sx={{height:"100%", background:"linear-gradient(135deg, var(--theme),var(--theme2),var(--theme2),var(--theme))"}}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="/" element={<Login/>} />
            <Route index element={<Login />} />
            <Route path="/guest" element={<Guest/>} />
              <>
              <Route path="/admin" element={<Admin/>} />
              <Route path="/student" element={<Student/>} />
              <Route path="/members" element={<Members/>} />
              </>
          </Route>
        </Routes>
      </BrowserRouter>
    </Box>

    </ThemeProvider>
  );
}

export default App;
