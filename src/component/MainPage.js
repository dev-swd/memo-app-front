import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../App';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { getContentsAll, getContentsWhereTitle, getContentsWhereCont, getContentsWhereTag } from '../lib/api/contents';
import { isEmpty } from '../lib/common/isEmpty';
import Loading from './common/Loading';

import NewPage from './ContNewPage';
import ShowPage from './ContShowPage';
import PwdChangePage from './PwdChangePage';

import { cmnProp } from './common/cmnConst';
import { signOut } from '../lib/api/deviseAuth';
import Cookies from 'js-cookie';

// ディレイ用
const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MainPage = () => {
  const { setIsSignedIn, currentUser, setCurrentUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [kbn, setKbn] = useState(0);    // 初期値：全件検索
  const [title, setTitle] = useState("");
  const [dispTitle, setDispTitle] = useState("");
  const [content, setContent] = useState("");
  const [dispContent, setDispContent] = useState("");
  const [tag, setTag] = useState("");
  const [dispTag, setDispTag] = useState("");
  const [privateScope, setPrivateScope] = useState(true);
  const [dispPrivateScope, setDispPrivateScope] = useState(true);

  const [data, setData] = useState([]);
  const [err, setErr] = useState({ severity: "", message: ""});
  const [isLoading, setIsLoading] = useState(false);

  // サブ画面制御
  const [isNewShow, setIsNewShow] = useState(false);
  const [showId, setShowId] = useState(null);
  const [isPwdShow, setIsPwdShow] = useState(false);

  // メニュー制御
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // アカウントメニュー制御
  const [anchorElAc, setAnchorElAc] = useState(null);
  const openAc = Boolean(anchorElAc);

  // ページング制御
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);   // 初期値：1ページ5行

  // 初期処理 & 全件検索トリガ
  useEffect(() => {
    if(kbn===0){
      setIsLoading(true);
      handleGetContentsAll(dispPrivateScope);
    }
  }, [kbn]);

  // 全件content取得
  const handleGetContentsAll = async (privateScope) => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getContentsAll((privateScope ? 'private' : ''), currentUser.id);
      if (res.status === 200) {
        // 正常
        setData(res.data);
        if (res.data.contents.length === 0) {
          setErr({severity: "error", message: "該当するデータがありませんでした。"});
        } else {
          setErr({severity: "", message: ""});
          setTitle("");
          setDispTitle("");
          setContent("");
          setDispContent("");
          setTag("");
          setDispTag("");
          setDispPrivateScope(privateScope);
        }
      } else {
        // error
        setErr({severity: "error", message: "contents取得APIでエラーが発生しました。"});
      }
    } catch (e) {
      // API Abend
      setErr({severity: "error", message: "contents取得API呼出に失敗しました。"});
    }
    setIsLoading(false);
  }  

  // タイトル条件contents取得
  const handleGetContentsWhereTitle = async (title, privateScope) => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getContentsWhereTitle(title, (privateScope ? 'private' : ''), currentUser.id);
      if (res.status === 200) {
        // 正常
        setData(res.data);
        if (res.data.contents.length === 0) {
          setErr({severity: "error", message: "該当するデータがありませんでした。"});
        } else {
          setErr({severity: "", message: ""});
          setDispTitle(title);
          setContent("");
          setDispContent("");
          setTag("");
          setDispTag("");
          setDispPrivateScope(privateScope);
        }
      } else {
        // error
        setErr({severity: "error", message: "contents取得APIでエラーが発生しました。"});
      }
    } catch (e) {
      // API Abend
      setErr({severity: "error", message: "contents取得API呼出に失敗しました。"});
    }
    setIsLoading(false);
  }

  // 本文条件contents取得
  const handleGetContentsWhereCont = async (cont, privateScope) => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getContentsWhereCont(cont, (privateScope ? 'private' : ''), currentUser.id);
      if (res.status === 200) {
        // 正常
        setData(res.data);
        if (res.data.contents.length === 0) {
          setErr({severity: "error", message: "該当するデータがありませんでした。"});
        } else {
          setErr({severity: "", message: ""});
          setDispContent(cont);
          setTitle("");
          setDispTitle("");
          setTag("");
          setDispTag("");
          setDispPrivateScope(privateScope);
        }
      } else {
        // error
        setErr({severity: "error", message: "contents取得APIでエラーが発生しました。"});
      }
    } catch (e) {
      // API Abend
      setErr({severity: "error", message: "contents取得API呼出に失敗しました。"});
    }
    setIsLoading(false);
  }

  // タグ条件contents取得
  const handleGetContentsWhereTag = async (tag, privateScope) => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getContentsWhereTag(tag, (privateScope ? 'private' : ''), currentUser.id);
      if (res.status === 200) {
        // 正常
        setData(res.data);
        if (res.data.contents.length === 0) {
          setErr({severity: "error", message: "該当するデータがありませんでした。"});
        } else {
          setErr({severity: "", message: ""});
          setDispTag(tag);
          setTitle("");
          setDispTitle("");
          setContent("");
          setDispContent("");
          setDispPrivateScope(privateScope);
        }
      } else {
        // error
        setErr({severity: "error", message: "contents取得APIでエラーが発生しました。"});
      }
    } catch (e) {
      // API Abend
      setErr({severity: "error", message: "contents取得API呼出に失敗しました。"});
    }
    setIsLoading(false);
  }

  // 全件検索ボタン押下時処理
  const handleSearchAll = () => {
    setIsLoading(true);
    handleGetContentsAll(privateScope);  
  }

  // タイトル検索ボタン押下時処理
  const handleSearchTitle = () => {
    if (isEmpty(title)) {
      setErr({severity: "error", message: "Titleが未入力です。"});
    } else {
      setErr({severity: "", message: ""});
      setIsLoading(true);
      handleGetContentsWhereTitle(title, privateScope);  
    }
  }

  // 本文検索ボタン押下時処理
  const handleSearchContent = () => {
    if (isEmpty(content)) {
      setErr({severity: "error", message: "Contentが未入力です。"});
    } else {
      setErr({severity: "", message: ""});
      setIsLoading(true);
      handleGetContentsWhereCont(content, privateScope);  
    }
  }

  // タグ検索ボタン押下時処理
  const handleSearchTag = () => {
    if (isEmpty(tag)) {
      setErr({severity: "error", message: "Tagが未入力です。"});
    } else {
      setErr({severity: "", message: ""});
      setIsLoading(true);
      handleGetContentsWhereTag(tag, privateScope);  
    }
  }

  // タイトルリンククリック時の処理
  const handleShowButtonClick = (id) => {
    setShowId(id);
  }

  // 詳細画面終了時の処理
  const handleCloseShow = () => {
    setShowId(null);
    refresh();
  }

  // アカウントアイコンクリックの処理
  const handleAccountIconClick = (e) => {
    setAnchorElAc(e.currentTarget);
  }

  // アカウント終了時の処理
  const handleAccountClose = () => {
    setAnchorElAc(null);
  }

  // サインアウト時の処理
  const handleSignoutClick = () => {
    handleSignOut();
    setAnchorElAc(null);
  }

  // パスワード変更メニュークリック時の処理
  const handleChangePwdClick = () => {
    setIsPwdShow(true);
    setAnchorElAc(null);
  }

  // パスワード変更画面終了時の処理
  const handleClosePwd = () => {
    setIsPwdShow(false);
  }

  // メニューボタンクリック時の処理
  const handleMenuIconClick = (e) => {
    setAnchorEl(e.currentTarget);
  }

  // メニュー終了時の処理
  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  // 新規登録メニュークリック時の処理
  const handleNewMenuClick = () => {
    setIsNewShow(true);
    setAnchorEl(null);
  }

  // 新規登録画面終了時の処理
  const handleCloseNew = () => {
    setIsNewShow(false);
    refresh();
  }

  // 画面リフレッシュ
  const refresh = () => {
    switch(kbn){
      case 0:
        handleGetContentsAll(dispPrivateScope);
        break;
      case 1:
        if(isEmpty(dispTitle)){
          setData([]);
        } else {
          handleGetContentsWhereTitle(dispTitle, dispPrivateScope);
        }
        break;
      case 2:
        if(isEmpty(dispContent)){
          setData([]);
        } else {
          handleGetContentsWhereCont(dispContent, dispPrivateScope);
        }
        break;
      case 3:
        if(isEmpty(dispTag)){
          setData([]);
        } else {
          handleGetContentsWhereTag(dispTag, dispPrivateScope);
        }
        break;
      default:
        setData([]);
    }
  }

  // 検索区分メニュークリック時の処理
  const handleKbnMenuClick = (kbn) => {
    setKbn(kbn);
    setAnchorEl(null);
  }

  // ページ変更時の処理
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  }

  // １ページの表示行数変更時の処理
  const handleChangeRowsPerPage = (rows) => {
    setRowsPerPage(rows);
  }

  // サインアウト処理
  const handleSignOut = async (e) => {
    try {
      const res = await signOut();
      if(res.data.success===true){
        // 各Cookieをクリア
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        // サインイン情報クリア
        setIsSignedIn(false);
        setCurrentUser({});

        // サインイン画面に遷移
        navigate(`/signin`);
      } else {
        alert('サインアウトに失敗しました。');
        // サインイン画面に遷移
        navigate(`/signin`);
      }
    } catch (e) {
      alert('サインアウトに失敗しました。(abend)');
      // サインイン画面に遷移
      navigate(`/signin`);
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
              onClick={handleMenuIconClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='top-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={(e) => handleKbnMenuClick(0)}>全件検索</MenuItem>
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={(e) => handleKbnMenuClick(1)}>タイトル検索</MenuItem>
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={(e) => handleKbnMenuClick(2)}>本文検索</MenuItem>
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={(e) => handleKbnMenuClick(3)}>タグ検索</MenuItem>
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={handleNewMenuClick}>新規登録</MenuItem>
            </Menu>

            <Typography variant='h6' component="div" sx={{ flexGrow: 1 }}>メモ管理</Typography>
            <IconButton
              size="large"
              edge="end"
              color='inherit'
              aria-label="account"
              onClick={handleAccountIconClick}
            >
              <AccountCircleIcon fontSize='inherit'/>
            </IconButton>
            <Menu
              id='account-menu'
              anchorEl={anchorElAc}
              open={openAc}
              onClose={handleAccountClose}
            >
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={handleSignoutClick}>サインアウト</MenuItem>
              <MenuItem sx={{fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily}} onClick={handleChangePwdClick}>パスワード変更</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1}>
        <Alert severity={err.severity}>{err.message}</Alert>
      </Stack>
      }

      <FormControlLabel
        sx={{ mt: 2, ml: 2 }}
        control={<Switch checked={privateScope} onChange={(e) => setPrivateScope(e.target.checked)} />}
        label="Private"
      />

      {/* 全件検索 */}
      { kbn === 0 &&
      <Box sx={{ mt: 2, ml: 3 }}>
        <Button
          variant="contained" 
          endIcon={<SearchIcon />} 
          onClick={(e) => handleSearchAll()}
        >
          検索
        </Button>
      </Box>
      }

      {/* タイトル検索 */}
      { kbn === 1 &&
      <Box sx={{ mt: 2, ml: 3 }}>
        <TextField
          id="title"
          name="title"
          label="Title"
          value={title}
          variant="outlined"
          size="small"
          style={{width: 'calc(100% - 200px)'}}
          inputProps={{maxLength:20, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          variant="contained" 
          endIcon={<SearchIcon />} 
          sx={{ ml: 3 }}
          onClick={(e) => handleSearchTitle()}
        >
          検索
        </Button>
        <p style={{paddingLeft: '2px', fontSize: cmnProp.fontSize - 2, fontFamily: cmnProp.fontFamily}}>※部分一致検索となります。</p>
      </Box>
      }

      {/* 本文検索 */}
      { kbn === 2 &&
      <Box sx={{ mt: 2, ml: 3 }}>
        <TextField
          id="content"
          name="content"
          label="Content"
          value={content}
          variant="outlined"
          size="small"
          style={{width: 'calc(100% - 200px)'}}
          inputProps={{maxLength:20, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          variant="contained" 
          endIcon={<SearchIcon />} 
          sx={{ ml: 3 }}
          onClick={(e) => handleSearchContent()}
        >
          検索
        </Button>
        <p style={{paddingLeft: '2px', fontSize: cmnProp.fontSize - 2, fontFamily: cmnProp.fontFamily}}>※部分一致検索となります。</p>
      </Box>
      }

      {/* タグ検索 */}
      { kbn === 3 &&
      <Box sx={{ mt: 2, ml: 3 }}>
        <TextField 
          id="tag"
          name="tag"
          label="Tag"
          value={tag}
          variant="outlined"
          size="small"
          style={{width: 'calc(100% - 200px)'}}
          inputProps={{maxLength:20, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
          onChange={(e) => setTag(e.target.value)}
        />
        <Button
          variant="contained" 
          endIcon={<SearchIcon />} 
          sx={{ ml: 3 }}
          onClick={(e) => handleSearchTag()}
        >
          検索
        </Button>
      </Box>
      }

      <Box sx={{ m: 3 }}>
        <table cellSpacing={0} style={{ width: '100%' }}>
          <thead>
            <tr style={{ height: '40px' }}>
              <td style={{ borderBottom: '2px inset #c8c8c8', width: '70px' }}>No.</td>
              <td style={{ borderBottom: '2px inset #c8c8c8', width: 'auto' }}>title</td>
            </tr>
          </thead>
          <tbody>
            {data.contents ? (
              data.contents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c,i) => 
                <tr key={"cont-" + i} style={{ height: '40px' }}>
                  <td style={{ borderBottom: '1px inset #c8c8c8' }}>{page * rowsPerPage + i + 1}</td>
                  <td style={{ borderBottom: '1px inset #c8c8c8' }}>
                    <button 
                      className='link-style-btn' 
                      type='button' 
                      style={{ textAlign: 'left'}}
                      onClick={() => handleShowButtonClick(c.id)}
                    >
                      {c.title}
                    </button>
                  </td>
                </tr>
              )
            ) : (
              <></>
            )}
          </tbody>
        </table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={data.contents? data.contents.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={(e) => handleChangeRowsPerPage(e.target.value)}
        />
      </Box>

      <NewPage isShow={isNewShow} close={handleCloseNew} />
      <ShowPage contId={showId} uid={currentUser.id} close={handleCloseShow} />
      <PwdChangePage isShow={isPwdShow} close={handleClosePwd} />
      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default MainPage;