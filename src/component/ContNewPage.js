import { cmnProp } from './common/cmnConst';
import { useState } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../App';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAlt from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ConfirmDlg from './common/ConfirmDlg';
import Loading from './common/Loading';

import { isEmpty } from '../lib/common/isEmpty';
import { createContent } from '../lib/api/contents';

const ContNewPage = (props) => {
  const { isShow, close } = props;
  const { currentUser } = useContext(GlobalContext);

  const [err, setErr] = useState({ severity: "", message: ""});
  const [confirm, setConfirm] = useState({ message: null, tag: null, width: null });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privateScope, setPrivateScope] = useState(true);
  const [tags, setTags] = useState([]);

  const [titleErr, setTitleErr] = useState(false);
  const [contentErr, setContentErr] = useState(false);
  const [tagsErr, setTagsErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    setTitle("");
    setContent("");
    setPrivateScope(true);
    setTags([]);
    setTitleErr(false);
    setContentErr(false);
    setTagsErr(false);
    setErr({ severity: "", message: ""});
    close();
  }

  // タグ追加処理
  const handleAddTag = () => {
    setTags([
      ...tags,
      {tag: ""},
    ]);
  }

  // タグ入力時の処理
  const handleChangeTag = (i, v) => {
    const tmpTags = [...tags];
    tmpTags[i]["tag"] = v;
    setTags(tmpTags);
  }

  // タグ削除処理
  const handleDelTag = (i) => {
    const tmpTags = [...tags];
    tmpTags.splice(i,1);
    setTags(tmpTags);
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    // 入力チェック
    let errflg = false;
    if (isEmpty(title)) {
      setTitleErr(true);
      errflg = true;
    } else {
      setTitleErr(false);
    }
    if (isEmpty(content)) {
      setContentErr(true);
      errflg = true;
    } else {
      setContentErr(false);
    }
    let tagcnt = 0;
    for(let i=0; i<tags.length; ++i){
      if(!isEmpty(tags[i].tag)){
        tagcnt += 1;
      }
    }
    if(tagcnt === 0){
      setTagsErr(true);
      errflg = true;
    } else {
      setTagsErr(false);
    }

    if (!errflg) {
      // エラーがない場合のみ登録確認
      setConfirm({
        ...confirm,
        message: "新しいメモを登録します。よろしいですか？",
        tag: null,
        width: 400,
      });
    }
  }

  // 登録OK処理
  const handleSubmitOk = (dummy) => {
    setConfirm({
      ...confirm,
      message: null,
      tag: null,
      width: null,
    });
    setIsLoading(true);
    submitContent();
  }

  // コンテンツ登録
  const submitContent = async () => {

    try {
      const res = await createContent({
        cont: 
          {title: title,
            content: content,
            scope: (privateScope ? "private" : "public"),
            makeid: currentUser.id,
            updateid: currentUser.id,
          },
        tags: tags 
      });
      setIsLoading(false);
      if (res.data.status === 500){
        setErr({severity: "error", message: "content登録エラーが発生しました。(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setErr({severity: "error", message: "content登録APIの実行でエラーが発生しました。"});
      setIsLoading(false);
    }

  }

  // 登録Cancel処理
  const handleSubmitCancel = () => {
    setConfirm({
      ...confirm,
      message: null,
      tag: null,
      width: null,
    });
  }

  return (
    <>
      { isShow ? (
        <div className="fullscreen">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
              <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>新しいメモ</Typography>
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

          <Box sx={{ ml: 3, mr: 3 }}>
            <Button
              variant="contained"
              endIcon={<SaveAlt />}
              onClick={(e) => handleSubmit()}
            >
              登録
            </Button>
          </Box>

          <Box sx={{ m: 3 }}>
            <TextField 
              id="title"
              name="title"
              label="title"
              value={title}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{maxLength:50, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleErr && (
              <p style={{paddingLeft: '10px', color: 'red', fontSize: cmnProp.fontSize - 2, fontFamily: cmnProp.fontFamily}}>titleが未入力です。</p>
            )}

            <TextField 
              id="content"
              name="content"
              label="content"
              value={content}
              variant="outlined"
              size="small"
              fullWidth
              multiline
              sx={{ mt: 3 }}
              minRows={4}
              maxRows={10}
              inputProps={{maxLength:200, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
              onChange={(e) => setContent(e.target.value)}
            />
            {contentErr && (
              <p style={{paddingLeft: '10px', color: 'red', fontSize: cmnProp.fontSize - 2, fontFamily: cmnProp.fontFamily}}>contentが未入力です。</p>
            )}

            <FormControlLabel
              sx={{ mt: 2 }}
              control={<Switch checked={privateScope} onChange={(e) => setPrivateScope(e.target.checked)} />}
              label="Private"
            />

            <Typography variant='h6' component="div" sx={{pl: 1, mt: 3, color: 'primary.main', bgcolor: '#CCE5FF', borderBottom: 2, borderColor: 'primary.main'}}>Tag</Typography>
            {tagsErr && (
              <p style={{paddingLeft: '10px', color: 'red', fontSize: cmnProp.fontSize - 2, fontFamily: cmnProp.fontFamily}}>Tagは最低１つの登録が必要です。</p>
            )}

            {tags ? (
              tags.map((t, i) => 
                <Box sx={{ mt: 2, ml: 6, mr: 3 }}>
                  <TextField
                    id={"tag" + i}
                    name="tag"
                    label="Tag"
                    value={t.tag}
                    variant="outlined"
                    size="small"
                    style={{ width: 'calc(100% - 40px)'}}
                    inputProps={{maxLength:50, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
                    onChange={(e) => handleChangeTag(i, e.target.value)}
                  />
                  <IconButton aria-label='Del' color='primary' size='small' onClick={() => handleDelTag(i)}>
                    <DeleteIcon fontSite='inherit' />
                  </IconButton>
                </Box>
              )
            ) : (
              <></>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
              <IconButton aria-label='Add' color='primary' size='large' onClick={() => handleAddTag()}>
                <AddCircleIcon sx={{ fontSize : 40 }} />
              </IconButton>
            </Box>

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
export default ContNewPage;