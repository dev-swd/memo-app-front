// 未設定チェック共通処理

// ノーマルタイプ
export const isEmpty = (v) => {
  if(v===undefined || v===null || v==="") {
    return true;
  } else {
    return false;
  }
}

// 0も未設定判定
export const isEmptyOrZero = (v) => {
  if(v===undefined || v===null || v==="" || v===0) {
    return true;
  } else {
    return false;
  }
}
