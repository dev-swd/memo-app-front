import './App.css';
import { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/api/deviseAuth';

import MainPage from './component/MainPage';
import SigninPage from './component/SigninPage';
import SignupPage from './component/SignupPage';

// グローバル情報
export const GlobalContext = createContext({});

const App = () => {
  const [loading, setLoading] = useState(true);
  // 認証情報
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  // 認証済みのユーザがいるかチェック
  // 確認できた場合はそのユーザ情報を取得
  const handleGetCurrentUser = () => {
    try {
      const res = getCurrentUser();
      if(res?.data.is_login === true){
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
      } else {
        // ログアウトになった場合の画面遷移
        setLoading(false);
        return <Navigate to="/signin" />
      }
    } catch (e) {
      // ログイン状態確認エラー時の画面遷移
      setLoading(false);
      return <Navigate to="/signin" />
    }
    setLoading(false);
  }

  // 初期処理（認証確認）
  useEffect(() => {
    setLoading(true);
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // ユーザが認証済みかどうかでルーティングを決定
  // 未承認だった場合は「/signin」ページに促す
  const Private = ({children}) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        return <Navigate to="/signin" />
      }
    } else {
      return <></>;      
    }
  }

  return (
    <Router>
      <GlobalContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <Routes>
          <Route exact path='/signin' element={<SigninPage />} />
          <Route exact path='/signup' element={<SignupPage />} />
          <Route exact path='/' element={!loading && <Private><MainPage /></Private>} />
        </Routes>
      </GlobalContext.Provider>
    </Router>
  );
}

export default App;
