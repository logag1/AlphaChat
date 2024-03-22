import style from './css/main.module.css';
import Swal from 'sweetalert2';
import { FiUserPlus } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { GoInfo } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { MdExitToApp } from "react-icons/md";
import profileImg from '../images/profile.jpg';
import backgroundImg from '../images/background.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ToggleButton from './ToggleButton';

const { ipcRenderer } = window.require('electron');

function AddFriendToList({ originalElements }) {
  let navigate = useNavigate();

  return (
    <div className='scroll_box'>
      {Object.values(originalElements).map((element, index) => (
        <div key={index} className={style.item}>
          <img src={profileImg} alt="" className={style.profileImg} />
          <div className={style.name}>{element.nickname.length > 8 ? element.nickname.substring(0, 8) + '...' : element.nickname}</div>
          <div className={style.online}>(온라인)</div>
          <BiMessageSquareDetail onClick={() => navigate(`/chat/${element.userId}`)} className={style.icon} />
        </div>
      ))}
    </div>
  );
}

function SetInfoComponent() {
  return (
    <div>
      <div className={style.category}>
        <span className={style.categoryTitle}>앱 정보</span>
        <span className={style.categoryContent}>알파톡 Beta 1.0</span>
      </div>
      <div className={style.category}>
        <span className={style.categoryTitle}>계정 정보</span>
        <span className={style.categoryContent}>이메일: 엄준식</span>
      </div>
    </div>
  );
}

/**
 * 참여코드 설정
 * 알림 설정
 * 친구추가 가능여부 설정
 * 톡디 설정
 */
function SetSettingComponent() {
  return (
    <div>
      <div className={style.settingContainer}>
        <span style={{ paddingLeft: '7px' }}>알림</span>
        <ToggleButton />
      </div>
      <div className={style.settingContainer}>
        <span style={{ paddingLeft: '7px' }}>친구 요청</span>
        <ToggleButton />
      </div>
    </div>
  );
}

function SetProfileComponent() {
  return (
    <h1>Profile Component</h1>
  );
}

export default function Main() {
  const [friendList, setFriendList] = useState(null);
  const navigate = useNavigate();
  const [showSettingComponent, setShowSettingComponent] = useState(false);
  const [showInfoComponent, setShowInfoComponent] = useState(false);
  const [showProfileComponent, setShowProfileComponent] = useState(true);

  const handleInfoClick = () => {
    setShowSettingComponent(false);
    setShowProfileComponent(false);

    setShowInfoComponent(!showInfoComponent);
  };

  const handleSettingsClick = () => {
    setShowInfoComponent(false);
    setShowProfileComponent(false);

    setShowSettingComponent(!showSettingComponent);
  };

  const handleProfileClick = () => {
    setShowInfoComponent(false);
    setShowSettingComponent(false);

    setShowProfileComponent(!showProfileComponent);
  }

  useEffect(() => {
    ipcRenderer.send('REQ_TOKEN');

    ipcRenderer.on('TOKEN_RES', async (evt, token) => {
      const res = await fetch('http://localhost/talk/friends', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      await setFriendList(data.result);
    });
  }, []);

  const logout = () => {
    Swal.fire({
      title: '정말 로그아웃 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소',
    }).then((result) => {
      if (!result.dismiss) {
        ipcRenderer.send('LOGOUT');
        navigate('/');
      }
    });
  }

  const getInput = () => {
    Swal.fire({
      icon: 'info',
      title: '친구 추가',
      showCancelButton: true,
      inputPlaceholder: '친구의 아이디를 입력해주세요..',
      input: 'text',
      confirmButtonColor: '#3085d6',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(res => {
      if (!res.isDismissed) return AddFriend(res.value);
    });
  };

  const AddFriend = async (talkId) => {
    const token = await new Promise((resolve) => {
      ipcRenderer.send('REQ_TOKEN');
      ipcRenderer.once('TOKEN_RES', (evt, token) => {
        resolve(token);
      });
    });

    const res = await fetch('http://localhost/talk/friends/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        friendTalkId: talkId
      })
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire({
        icon: 'success',
        text: '친구 추가를 성공했어요'
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: data.message
      });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className={style.friendContainer}>
        <div style={{ display: 'flex' }}>
          <span className={style.title}>친구</span>
          <FiUserPlus onClick={getInput} style={{ fontSize: '27px', marginLeft: '170px', padding: '8px' }} />
        </div>

        <div className={style.friends}>
          {friendList ? (
            <AddFriendToList originalElements={friendList} />
          ) : (
            <div className={{ fontWeight: 'bolder' }}>Loading...</div>
          )}
        </div>
      </div>
      {/*<img src={backgroundImg} alt="" className={style.backgroundImg} />*/}
      <div className={style.contentContainer}>
        {showInfoComponent && <SetInfoComponent />}
        {showSettingComponent && <SetSettingComponent />}
        {showProfileComponent && <SetProfileComponent />}
      </div>
      <div className={style.menuContainer}>
        <img src={profileImg} onClick={handleProfileClick} alt="" className={style.myProfile} />
        <GoInfo onClick={handleInfoClick} className={style.logo} />
        <IoSettingsOutline onClick={handleSettingsClick} className={style.logo} />
        <MdExitToApp onClick={logout} className={style.logo} />
      </div>
    </div>
  );
}