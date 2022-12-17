import { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import { cmnProp } from './common/cmnConst';
import { getContentWhereId, deleteContent } from '../lib/api/contents';
import { isEmpty } from '../lib/common/isEmpty';

import EditPage from './ContEditPage';
import ConfirmDlg from './common/ConfirmDlg';
import Loading from './common/Loading';

const ContShowPage = (props) => {
  const { contId, uid, close } = props;
  const [content, setContent] = useState({});
  const [err, setErr] = useState({ severity: "", message: ""});
  const [confirm, setConfirm] = useState({ message: null, tag: null, width: null });

  const [isLoading, setIsLoading] = useState(false);

  const [editId, setEditId] = useState(null);

  // 初期処理
  useEffect(() => {
    if(!isEmpty(contId)){
      setIsLoading(true);
      handleGetContent();
    }
  }, contId);

  // コンテンツ取得
  const handleGetContent = async () => {
    try {
      const res = await getContentWhereId(Number(contId));
      setContent(res.data.content);
    } catch (e) {
      setErr({severity: "error", message: "content取得APIの実行でエラーが発生しました。"});
    }
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    setContent({});
    setErr({ severity: "", message: ""});
    close();
  }

  // 編集ボタン押下時の処理
  const handleEditButtonClick = () => {
    setEditId(contId);
  }

  // 削除ボタン押下時の処理
  const handleDeleteButtonClick = () => {
    setConfirm({
      ...confirm,
      message: "メモを削除します。よろしいですか？",
      tag: null,
      width: 400,
    });
  }

  // 削除OK処理
  const handleDeleteOk = (dummy) => {
    setConfirm({
      ...confirm,
      message: null,
      tag: null,
      width: null,
    });
    
    setIsLoading(true);

    delContent();

  }

  // コンテンツ削除
  const delContent = async () => {

    try {
      const res = await deleteContent(contId);
      setIsLoading(false);
      if (res.data.status === 500){
        setErr({severity: "error", message: "content削除エラーが発生しました。(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setErr({severity: "error", message: "content削除APIの実行でエラーが発生しました。"});
      setIsLoading(false);
    }
  }

  // 削除Cancel処理
  const handleDeleteCancel = () => {
    setConfirm({
      ...confirm,
      message: null,
      tag: null,
      width: null,
    });
  }

  // 編集画面終了時の処理
  const handleCloseEdit = () => {
    setEditId(null);
    handleGetContent();
  }

  // 画面表示
  return (
    <>
      { contId ? (
        <div className="fullscreen">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
              <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>メモ</Typography>
                <IconButton
                  size='large'
                  edge='end'
                  color='inherit'
                  aria-label='close'
                  onClick={(e) => handleClose()}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>

          {(err.severity) &&
            <Stack sx={{width: '100%'}} spacing={1}>
              <Alert severity={err.severity}>{err.message}</Alert>
            </Stack>
          }

          <Box sx={{ mt: 3, ml: 3, mr: 3 }}>
            <div style={{ fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily, fontWeight: 'bold' }}>タイトル</div>
            <div style={{ fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily, border: '3px inset #1e90ff', borderRadius: '7px', backgroundColor: '#e0ffff', height: 'auto', padding: '5px'}}>{content.title}</div>
          </Box>
          <Box sx={{ m: 3 }}>
            <div style={{ fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily, fontWeight: 'bold' }}>コンテンツ</div>
            <div style={{ fontSize: cmnProp.fontSize, fontFamily: cmnProp.fontFamily, border: '3px inset #1e90ff', borderRadius: '7px', backgroundColor: '#e0ffff', minHeight: '100px', height: 'auto', padding: '5px', whiteSpace: 'pre-wrap', overflowY: 'auto', overflowX: 'hidden' }}>{content.content}</div>
          </Box>

          { uid === content.makeid ? 
            <>
              <Button
                sx={{ ml: 3, mb: 3 }}
                variant="contained"
                endIcon={<EditIcon />}
                onClick={(e) => handleEditButtonClick()}
              >
                  編集
              </Button>
              <Button
                sx={{ ml: 3, mb: 3 }}
                variant="contained"
                endIcon={<DeleteIcon />}
                onClick={(e) => handleDeleteButtonClick()}
                disabled={ !(uid === content.makeid)}
              >
                  削除
              </Button>
            </>
          :
            <></>
          }

          <EditPage contId={editId} close={handleCloseEdit} />
          <ConfirmDlg confirm={confirm} handleOk={handleDeleteOk} handleCancel={handleDeleteCancel} />
          <Loading isLoading={isLoading} />

        </div>
      ) : (
        <></>
      )}
    </>
  )

}
export default ContShowPage;
