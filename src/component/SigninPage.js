import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalContext } from '../App';
import { cmnProp } from './common/cmnConst';
import { signIn } from '../lib/api/deviseAuth';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from "@mui/icons-material/Menu";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import Cookies from 'js-cookie';

import Loading from './common/Loading';

const SigninPage = () => {
  const { setIsSignedIn, setCurrentUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [err, setErr] = useState({ severity: "", message: ""});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // submitボタン押下時の処理
  const handleSubmit = async (e) => {
    
    setIsLoading(true);

    submitSignIn();

  }

  // サインイン
  const submitSignIn = async () => {

    try {
      const res = await signIn({email: email, password: password});
      setIsLoading(false);
      if(res.status === 200){
        // サインイン成功の場合、Coolieに格納
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])
        
        // サインイン情報セット
        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        // メイン画面に遷移
        navigate(`/`);
        
      } else {
        // error
        setErr({severity: "error", message: "Invalid email or password"});
      }
    } catch (e) {
      // error
      setErr({severity: "error", message: "Invalid email or password"});
      setIsLoading(false);
    } 
  }

  // 画面編集
  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color='inherit'
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component="div" sx={{ flexGrow: 1 }}>メモ管理</Typography>
            <Button component={Link} to="/signup" sx={{textTransform: 'none', fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily}} color="inherit">Sign up</Button>
          </Toolbar>
        </AppBar>
      </Box>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1}>
        <Alert severity={err.severity}>{err.message}</Alert>
      </Stack>
      }

      <Box component='div' sx={{ mt: 5, paddingLeft: 2, paddingRight: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
      <Card style={{ padding: '2', maxWidth: '600px' }}>
        <CardHeader style={{ textAlign: 'center' }} title='Sign in' />
        <CardContent>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="small"
            type="email"
            autoComplete='username'
            inputProps={{maxLength:255, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
            InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          />
          <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
            <InputLabel htmlFor="current-password" style={{ fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily }}>Password</InputLabel>
            <OutlinedInput
              id="current-password"
              type={passwordShow ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={(e) => setPasswordShow(!passwordShow)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {passwordShow ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button 
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            color="primary"
            disabled={ !email || !password ? true : false}
            onClick={(e) => handleSubmit(e)}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Submit
          </Button>          
        </CardContent>
      </Card>
      </Box>

      <Loading isLoading={isLoading} />

    </Box>
  );
}
export default SigninPage;