import { cmnProp } from './cmnConst';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { isEmpty } from '../../lib/common/isEmpty';

const ConfirmDlg = (props) => {
  const { confirm, handleOk, handleCancel } = props;

  return (
    <>
      { confirm.message ? (
        <div className="overlay">
          <Box sx={{ width: '100%', maxWidth: isEmpty(confirm.width) ? 400 : confirm.width, bgcolor: 'background.paper', borderRadius: '10px', border: '5px solid #1e90ee' }}>
            <Box sx={{ mt: 3, ml: 3, mr: 3, mb:3 }}>
              <Box>
                <Typography fontSize={cmnProp.fontSize} fontFamily={cmnProp.fontFamily}>{confirm.message}</Typography>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={(e) => handleOk(confirm.tag)}>OK</Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={(e) => handleCancel()}>Cancel</Button>            
              </Box>
            </Box>
          </Box> 
        </div>
      ) : (
        <></>
      )}
    </>
  )

}
export default ConfirmDlg;