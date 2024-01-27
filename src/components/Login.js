import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiAccountCircleLine } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import Swal from 'sweetalert2';

const { ipcRenderer } = window.require('electron');

const styles = {
  body: {
    margin: '0',
  },
  container: {
  },
  componentContainer: {
    width: '300px',
    height: '540px',
    backgroundColor: 'RGB(220, 220, 220)',
    borderLeft: '1.5px solid lightgray',
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    alignItems: 'center',
    flexDirection: 'column'
  },
  lightLogo: {
    fontSize: '30px',
    padding: '5px',
    color: '#000000',
    textShadow: '1px 1px 1px #fff',
    fontFamily: 'SUIT-Regular',
    fontWeight: 'bolder'
  },
  flexContainer: {
    display: 'flex',
  },
  menuButton: {
    backgroundColor: '#1E2019',
    height: '45px',
    padding: '5px 20px',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontFamily: 'SUIT-Regular',
    fontSize: '20px',
    marginTop: '15px',
  },
  input: {
    width: '300px',
    height: '60px',
    marginBottom: '20px',
    borderWidth: '0 0 3px',
    borderColor: 'lightgray',
    fontFamily: 'SUIT-Regular',
    fontSize: '20px',
    fontWeight: 'bold',
    outline: 'none'
  },
  icon: {
    marginRight: '10px',
    fontSize: '35px',
    marginTop: '15px'
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '410px',
    padding: '10px',
    marginLeft: '30px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '290px'
  },
  version: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    padding: '10px',
    fontWeight: 'bolder'
  }
};

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
    <div style={styles.body}>
      <div style={styles.flexContainer}>
        <div>
          <div style={styles.inputContainer}>
            <div style={styles.flexContainer}>
              <RiAccountCircleLine style={styles.icon} />
              <input
                name="아이디"
                value={id}
                placeholder="아이디"
                onChange={(e) => setId(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.flexContainer}>
              <RiLockPasswordLine style={styles.icon} />
              <input
                name="비밀번호"
                value={pw}
                placeholder="비밀번호"
                onChange={(e) => setPw(e.target.value)}
                style={styles.input}
                type="password"
                onKeyPress={handleOnKeyPress}
              />
            </div>
            <button onClick={requestLogin} style={{ ...styles.menuButton, width: '350px', margin: '10px 0px' }}>로그인</button>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '5px 3px' }}>
              <hr style={{ width: '50px', marginRight: '7px' }} />
              <span style={{ fontWeight: 'lighter', fontSize: '13px' }}>아직 계정이 없다면?</span>
              <hr style={{ width: '50px', marginLeft: '7px' }} />
            </div>
            <button onClick={requestLogin} style={{ ...styles.menuButton, width: '350px' }}>회원가입</button>
          </div>
        </div>
        {/*<div style={styles.componentContainer}>
          <button style={{ ...styles.menuButton, marginBottom: '20px' }}>공식사이트 바로 가기</button>
  </div>*/}
        <div style={styles.version}>Beta 1.0</div>
      </div>
    </div >
  );
}
