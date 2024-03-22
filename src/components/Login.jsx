import style from './css/login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiAccountCircleLine } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import Swal from 'sweetalert2';

const { ipcRenderer } = window.require('electron');

export default function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const requestLogin = async () => {
    try {
      if (id == "" || pw == "") {
        return Swal.fire({
          title: '경고',
          icon: 'warning',
          text: '아이디 또는 비밀번호를 작성하지 않았습니다'
        });
      }

      const res = await fetch('http://localhost/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, pw })
      })

      const data = await res.json();

      if (data.success) {
        ipcRenderer.send("SAVE_TOKEN", data.result);
        Swal.fire({
          title: '로그인 성공',
          icon: 'success'
        });
        navigate('/main');
      } else {
        Swal.fire({
          title: '로그인 실패',
          icon: 'error',
          text: data.message
        });
      }
      console.log(data);
    } catch (e) {
      Swal.fire({
        title: '서버가 오프라인 상태입니다',
        text: '나중에 다시 시도해주세요'
      });
    }
  }

  const handleOnKeyPress = e => {
    if (e.key === 'Enter') {
      requestLogin();
    }
  };

  return (
    <div className={style.body}>
      <div className={style.flexContainer}>
        <div>
          <div className={style.inputContainer}>
            <div className={style.flexContainer}>
              <RiAccountCircleLine className={style.icon} />
              <input
                name="아이디"
                value={id}
                placeholder="아이디"
                onChange={(e) => setId(e.target.value)}
                className={style.input}
              />
            </div>
            <div className={style.flexContainer}>
              <RiLockPasswordLine className={style.icon} />
              <input
                name="비밀번호"
                value={pw}
                placeholder="비밀번호"
                onChange={(e) => setPw(e.target.value)}
                className={style.input}
                type="password"
                onKeyPress={handleOnKeyPress}
              />
            </div>
            <button onClick={requestLogin} className={style.login_btn}>로그인</button>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '5px 3px' }}>
              <hr style={{ width: '50px', marginRight: '7px' }} />
              <span style={{ fontWeight: 'lighter', fontSize: '13px' }}>아직 계정이 없다면?</span>
              <hr style={{ width: '50px', marginLeft: '7px' }} />
            </div>
            <button onClick={requestLogin} className={style.register_btn}>회원가입</button>
          </div>
        </div>
        {/*<div className={style.componentContainer}>
          <button className={{ ...style.menuButton, marginBottom: '20px' }}>공식사이트 바로 가기</button>
  </div>*/}
        <div className={style.version}>Beta 1.0</div>
      </div>
    </div >
  );
}
