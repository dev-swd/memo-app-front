import { useState } from 'react';

import { cmnProp } from './common/cmnConst';
import { updPassword } from '../lib/api/deviseAuth';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CloseIcon from '@mui/icons-material/Close';

import ConfirmDlg from './common/ConfirmDlg';
import Loading from './common/Loading';

const PwdChangePage = (props) => {
  const { isShow, close } = props;
  
  const [err, setErr] = useState({ severity: "", message: ""});
  const [confirm, setConfirm] = useState({ message: null, tag: null, width: null });
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordConShow, setPasswordConShow] = useState(false);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    setPassword("");
    setPasswordConfirmation("");
    setPasswordShow(false);
    setPasswordConShow(false);
    setErr({ severity: "", message: ""});
    close();
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      message: "パスワードを変更します。よろしいですか？",
      tag: null,
      width: 400,
    });
  }

  const handleSubmitOk = (dummy) => {
    setConfirm({
      ...confirm,
      message: null,
      tag: null,
      width: null,
    });

    setIsLoading(true);

    submitPassword();

  }

  const submitPassword = async () => {

    const params = {
      password: password,
      passwordConfirmation: passwordConfirmation
    }

    try {
      const res = await updPassword(params);
      if(res.status === 200){
        if(res.data.success){
          // 成功
          setErr({severity: "info", message: "パスワードを変更しました。"});
        } else {
          setErr({severity: "error", message: "パスワード変更に失敗しました。"});
        }
      } else {
        setErr({severity: "error", message: "パスワード変更APIでエラーが発生しました。"});
      }
    } catch (e) {
      setErr({severity: "error", message: "パスワード変更API呼出に失敗しました。"});
    }

    setIsLoading(false);

  }

  const handleSubmitCancel = () => {
    setConfirm({
      ...confirm,
      message: null,
      tag: null,
      width: null,
    });
    setIsLoading(false);
  }

  return (
    <>
      { isShow ? (
        <div className="fullscreen">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
              <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>パスワード変更</Typography>
                <IconButton
                  size="large"
                  edge="end"
                  color='inherit'
                  aria-label='close'
                  onClick={(e) => handleClose()}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>

          <Stack sx={{width: '100%'}} spacing={1}>
            <Alert severity={err.severity}>{err.message}</Alert>
          </Stack>

          <Box component='div' sx={{ mt: 5, paddingLeft: 2, paddingRight: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ padding: '2', maxWidth: '600px' }}>
              <CardHeader style={{ textAlign: 'center' }} title='New Password' />
              <CardContent>
                <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
                  <InputLabel htmlFor="new-password" style={{ fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily }}>Password</InputLabel>
                  <OutlinedInput
                    id="new-password"
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
                <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
                  <InputLabel htmlFor="new-password-confirmation" style={{ fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily }}>Password Confirmation</InputLabel>
                  <OutlinedInput
                    id="new-password-confirmation"
                    type={passwordConShow ? 'text' : 'password'}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    style={{ fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password confirmation visibility"
                          onClick={(e) => setPasswordConShow(!passwordConShow)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {passwordConShow ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password Confirmation"
                  />
                </FormControl>
                <Button 
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  color="primary"
                  disabled={ !password || !passwordConfirmation ? true : false}
                  onClick={(e) => handleSubmit(e)}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Submit
                </Button>          
              </CardContent>
            </Card>
          </Box>

          <ConfirmDlg confirm={confirm} handleOk={handleSubmitOk} handleCancel={handleSubmitCancel} />
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default PwdChangePage;
