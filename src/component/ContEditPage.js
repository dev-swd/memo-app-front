import { cmnProp } from './common/cmnConst';
import { useState, useEffect } from 'react';
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
import RestoreFromTrushIcon from '@mui/icons-material/RestoreFromTrash'
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ConfirmDlg from './common/ConfirmDlg';
import Loading from './common/Loading';

import { isEmpty } from '../lib/common/isEmpty';
import { getContentWhereId, updateContent } from '../lib/api/contents';

const ContEditPage = (props) => {
  const { contId, close } = props;
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
      setTitle(res.data.content.title);
      setContent(res.data.content.content);
      setPrivateScope((res.data.content.scope === "private"));
      const tmpTags = res.data.tags.map(t => {
        const tmpTag = {};
        tmpTag.id = t.id;
        tmpTag.tag = t.tag;
        tmpTag.del = false;
        return tmpTag;
      });
      setTags(tmpTags);
    } catch (e) {
      setErr({severity: "error", message: "content取得APIの実行でエラーが発生しました。"});
    }
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    setTitle("");
    setContent("");
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
      {id: "", tag: ""},
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
    if(isEmpty(tags[i].id)){
      tmpTags.splice(i,1);
    } else {
      tmpTags[i]["del"] = !(tags[i].del);
    }
    setTags(tmpTags);
  }

  // 更新ボタン押下時の処理
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
        message: "メモを更新します。よろしいですか？",
        tag: null,
        width: 400,
      });
    }
  }

  // 更新OK処理
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

  // コンテンツ更新
  const submitContent = async () => {

    try {
      const res = await updateContent(contId, {
        cont: 
          {title: title,
            content: content,
            scope: (privateScope ? "private" : "public"),
            updateid: currentUser.id,
          },
        tags: tags 
      });
      setIsLoading(false);
      if (res.data.status === 500){
        setErr({severity: "error", message: "content更新エラーが発生しました。(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setErr({severity: "error", message: "content更新APIの実行でエラーが発生しました。"});
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
      { contId ? (
        <div className='fullscreen'>
          <Box sx={{ flexGrow: 1}}>
            <AppBar position='static'>
              <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1}}>メモ変更</Typography>
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
              更新
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
              <table style={{ width: '100%' }}>
                <tbody>
                  {tags.map((t, i) => 
                    <tr key={'tag-' + i} style={{ }}>
                      <td style={{ width: '48px', fontSize: cmnProp.fontSize - 2, fontFamily: cmnProp.fontFamily, paddingTop: '16px', color: t.del ? '#F00' : '#1e90ee' }}>
                        <i><b>{t.id ? '' : 'New'}</b></i>
                        <i><b>{t.del ? 'Delete' : ''}</b></i>
                      </td>
                      <td style={{ width: 'calc(100% - 48px - 24px)'}}>
                        <TextField
                          id={"tag" + i}
                          name="tag"
                          label="Tag"
                          value={t.tag}
                          variant="outlined"
                          size="small"
                          error={t.del}
                          style={{ width: 'calc(100% - 40px)', marginTop: '16px' }}
                          inputProps={{maxLength:50, style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
                          InputLabelProps={{ style: {fontSize:cmnProp.fontSize, fontFamily:cmnProp.fontFamily} }}
                          onChange={(e) => handleChangeTag(i, e.target.value)}
                        />
                        { t.del ?
                          <IconButton aria-label='Del' color='error' size='small' onClick={() => handleDelTag(i)} sx={{ marginTop: '16px' }}>
                            <RestoreFromTrushIcon fontSite='inherit' />
                          </IconButton>
                        :
                          <IconButton aria-label='Del' color='primary' size='small' onClick={() => handleDelTag(i)} sx={{ marginTop: '16px' }}>
                            <DeleteIcon fontSite='inherit' />
                          </IconButton>
                        }
                      </td>
                      <td style={{ width: '24px'}}></td>
                    </tr>
                  )}
                </tbody>
              </table>
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
export default ContEditPage;
