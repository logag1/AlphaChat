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

const styles = {
  friendContainer: {
    width: '300px',
    height: '86vh',
    marginTop: '4vh',
    backgroundColor: 'RGB(242, 242, 242)',
    borderRadius: '10px',
    border: '1px solid lightgray',
    display: 'flex',
    justifyContent: 'flex-start',
    marginRight: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  friendsContainer: {
    overflowY: 'auto',
    maxHeight: '480px',
  },
  menuContainer: {
    width: '50px',
    height: '86vh',
    marginTop: '4vh',
    backgroundColor: 'RGB(242, 242, 242)',
    border: '1px solid lightgray',
    display: 'flex',
    borderRadius: '10px',
    justifyContent: 'flex-start',
    marginLeft: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  contentContainer: {
    width: '600px',
    height: '86vh',
    marginTop: '4vh',
    marginLeft: '20px',
    backgroundColor: 'RGB(242, 242, 242)',
    border: '1px solid lightgray',
    borderRadius: '10px',
    display: 'flex'
  },
  category: {
    width: '600px',
    height: '100px',
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '2px solid gray',
    textAlign: 'center',
  },
  title: {
    fontSize: '25px',
    fontWeight: 'bolder',
    fontFamily: 'SUIT-Regular',
    padding: '10px 20px'
  },
  friends: {
    alignItems: 'center',
    display: 'grid',
    gridGap: '15px',
    gridTemplateColumns: '1fr',
    width: '98%',
    padding: '5px',
  },
  item: {
    //backgroundColor: 'rgba(255, 255, 255, 1)',
    height: '30px',
    marginTop: '5px',
    padding: '15px 10px',
    wordBreak: 'keep-all',
    transition: '0.5s',
    borderTop: '0.5px solid lightgray',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    fontSize: '15px',
    fontWeight: 'bolder',
    marginRight: 'auto',
    paddingLeft: '10px'
  },
  statusMessage: {
    padding: '15px',
    fontSize: '13px',
    fontColor: 'lightgray'
  },
  profileImg: {
    width: '40px',
    height: '40px',
    borderRadius: '30%',
    overflow: 'hidden',
    border: '2px solid #dfc8c8',
  },
  icon: {
    fontSize: '30px'
  },
  backgroundImg: {
    display: 'flex',
    width: '400px',
    height: '400px',
    padding: '10px',
    textAlign: 'center',
    alignItems: 'center',
    paddingRight: '80px'
  },
  online: {
    fontSize: '15px',
    paddingRight: '15px'
  },
  logo: {
    fontSize: '35px',
    padding: '10px 0px',
  },
  settingContainer: {
    width: '590px',
    height: '70px',
    fontSize: '20px',
    display: 'flex',
    padding: '5px',
    marginLeft: 'auto',
    fontFamily: 'SOYOMapleBoldTTF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid lightgray',
    textAlign: 'center',
    alignItems: 'center'
  },
  categoryTitle: {
    fontSize: '20px',
    fontFamily: 'SOYOMapleBoldTTF',
    padding: '10px'
  },
  categoryContent: {
    fontFamily: 'SUITE-Regular',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  myProfile: {
    width: '33px',
    height: '33px',
    margin: '10px 0px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid black',
  }
}

function AddFriendToList({ originalElements }) {
  let navigate = useNavigate();

  return (
    <div className='scroll_box'>
      {Object.values(originalElements).map((element, index) => (
        <div key={index} style={styles.item}>
          <img src={profileImg} alt="" style={styles.profileImg} />
          <div style={styles.name}>{element.nickname.length > 8 ? element.nickname.substring(0, 8) + '...' : element.nickname}</div>
          <div style={styles.online}>(온라인)</div>
          <BiMessageSquareDetail onClick={() => navigate(`/chat/${element.userId}`)} style={styles.icon} />
        </div>
      ))}
    </div>
  );
}

function SetInfoComponent() {
  return (
    <div>
      <div style={styles.category}>
        <span style={styles.categoryTitle}>앱 정보</span>
        <span style={styles.categoryContent}>알파톡 Beta 1.0</span>
      </div>
      <div style={styles.category}>
        <span style={styles.categoryTitle}>계정 정보</span>
        <span style={styles.categoryContent}>이메일: 엄준식</span>
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
      <div style={styles.settingContainer}>
        <span style={{ paddingLeft: '7px' }}>알림</span>
        <ToggleButton />
      </div>
      <div style={styles.settingContainer}>
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
      <div style={styles.friendContainer}>
        <div style={{ display: 'flex' }}>
          <span style={styles.title}>친구</span>
          <FiUserPlus onClick={getInput} style={{ fontSize: '27px', marginLeft: '170px', padding: '8px' }} />
        </div>

        <div style={styles.friends}>
          {friendList ? (
            <AddFriendToList originalElements={friendList} />
          ) : (
            <div style={{ fontWeight: 'bolder' }}>Loading...</div>
          )}
        </div>
      </div>
      {/*<img src={backgroundImg} alt="" style={styles.backgroundImg} />*/}
      <div style={styles.contentContainer}>
        {showInfoComponent && <SetInfoComponent />}
        {showSettingComponent && <SetSettingComponent />}
        {showProfileComponent && <SetProfileComponent />}
      </div>
      <div style={styles.menuContainer}>
        <img src={profileImg} onClick={handleProfileClick} alt="" style={styles.myProfile} />
        <GoInfo onClick={handleInfoClick} style={styles.logo} />
        <IoSettingsOutline onClick={handleSettingsClick} style={styles.logo} />
        <MdExitToApp onClick={logout} style={styles.logo} />
      </div>
    </div>
  );
}